package me.ajfleming.tworoomsio.engine;

import static me.ajfleming.tworoomsio.timer.TimerUtils.setupTimer;

import com.corundumstudio.socketio.SocketIOServer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import me.ajfleming.tworoomsio.actions.PostRoomVoteAction;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.exception.UserException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.GameStage;
import me.ajfleming.tworoomsio.model.RoundMap;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.UsurpAttempt;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
import me.ajfleming.tworoomsio.service.deck.DeckDealerService;
import me.ajfleming.tworoomsio.service.lobby.JoinCodeGenerator;
import me.ajfleming.tworoomsio.service.rooms.HostageSwitchService;
import me.ajfleming.tworoomsio.service.rooms.RoomAllocationService;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.CardShareType;
import me.ajfleming.tworoomsio.socket.event.JoinRoomEvent;
import me.ajfleming.tworoomsio.socket.event.LeaderChangeEvent;
import me.ajfleming.tworoomsio.socket.event.ShowHostagesEvent;
import me.ajfleming.tworoomsio.socket.response.CardRevealResponse;
import me.ajfleming.tworoomsio.storage.GameCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GameEngineImpl implements GameEngine {

  private static final int TOTAL_ROUND_SECONDS = 180;
  private static final int MAX_ROUNDS = 3;
  private final SocketIOServer socketServer;
  private final DeckBuilderService deckBuilder;
  private final UserManager userManager;
  private final GameCache gameCache;
  private final JoinCodeGenerator joinCodeGenerator;

  @Autowired
  public GameEngineImpl(SocketIOServer socketServer, UserManager userManager, GameCache gameCache, JoinCodeGenerator joinCodeGenerator) {
    this.socketServer = socketServer;
    this.deckBuilder = new DeckBuilderService();
    this.userManager = userManager;
    this.gameCache = gameCache;
    this.joinCodeGenerator = joinCodeGenerator;
  }

  @Override
  public Game createNewGame(final User hostUser) {
    return Game.builder()
        .newGame(hostUser, joinCodeGenerator.generateJoinCode())
        .build();
  }

  @Override
  public void joinGame(final Game game, final User player) throws GameException {
    enforceGameCheck(game.getRound() == 0, "Game has already started");
    enforceGameCheck(game.findPlayer(player.getName()).isEmpty(),
        "Someone has already used that name! Maybe you have a popular name like Andrew? 🤔");
    game.addPlayer(player);
    addPlayerToGameComms(player, game);
    game.setDeck(deckBuilder.buildDeck(game.getTotalPlayerCount()));
    triggerGameUpdateEvent(game);
  }

  @Override
  public void reloadPlayerIntoGame(Game game, User player)
      throws GameException {
    enforceGameCheck(game.reconnectPlayer(player), "Failed to reconnect to game");
    addPlayerToGameComms(player, game);
    try {
      reloadPlayerGameData(game, player);
    } catch (UserException e) {
      throw new GameException("Failed to reload user into game");
    }

    triggerGameUpdateEvent(game);
  }

  @Override
  public void disconnectPlayer(final User player) {
    List<Game> games = gameCache.getGamesPlayerIsIn(player.getUserToken());
    for(Game game : games) {
      game.disconnectPlayer(player.getUserToken());
      if (game.getTotalPlayerCount() > 0) {
        triggerGameUpdateEvent(game);
      } else {
        gameCache.deleteGame(game.getId());
      }
    }
  }

  // Game Management Operations
  public void startGame(final Game game, final User requestor) throws GameException {
    enforceGameCheck(isGameReadyToStart(game), "Game cannot be currently started");
    enforceGameCheck(game.isUserHost(requestor), "User is not host");
    game.setRooms(RoomAllocationService.generateAndAllocateToRooms(game));
    game.setRoundData(RoundMap.getRoundData(game.getTotalPlayerCount()));
    game.setStage(GameStage.FIRST_ROOM_ALLOCATION);
    triggerGameUpdateEvent(game);
  }

  private boolean isGameReadyToStart(Game game) {
    return game.getDeck().size() == game.getPlayers().size();
  }

  @Override
  public void endRound(final Game game, final User requestor) throws GameException {
    enforceGameCheck(game.isUserHost(requestor), "User is not host");
    enforceGameCheck(!game.getTimer().isTimerRunning(),
        "Timer must not be running in order to proceed");
    enforceGameCheck(checkHostageCounts(game), "Not enough hostages");
    game.setStage(GameStage.END_OF_ROUND);
    triggerGameUpdateEvent(game);
    sendEventToGame(game,"REVEAL_HOSTAGES", new ShowHostagesEvent(game.getRooms()));
  }

  public boolean checkHostageCounts(Game game) {
    for (Room room : game.getRooms().values()) {
      if (room.getHostageCount() != game.getMaxHostages()) {
        return false;
      }
    }
    return true;
  }

  @Override
  public void nextRound(Game game, User requestor) throws GameException {
    if (game.isUserHost(requestor)) {
      if (game.getRound() >= MAX_ROUNDS) {
        endGameAndCalculateResults(game);
      } else if (game.getRound() == 0) {
        // Deal Cards for First Round
        game.setCardAssignments(DeckDealerService.dealDeck(game.getDeck(), game.getPlayers()));
      }
      game.nextRound();
      game.setTimer(setupTimer(TOTAL_ROUND_SECONDS, game.getId(), socketServer));
      game.setStage(GameStage.IN_ROUND);
      clearEventsAndRequests(game);
      triggerGameUpdateEvent(game);
    }
  }

  private void clearEventsAndRequests(Game game) throws GameException {
    sendEventToGame(game,"CLEAR_EVENTS", null);
    game.resetCardShares();
  }

  @Override
  public void startTimer(final Game game, final User requestor) throws GameException {
    enforceGameCheck(game.isUserHost(requestor), "You are not the host of the game!");
    game.getTimer().start();
  }

  @Override
  public void pauseTimer(final Game game, final User requestor) throws GameException {
    enforceGameCheck(game.isUserHost(requestor), "You are not the host of the game!");
    game.getTimer().stop();
  }

  @Override
  public void restartTimer(final Game game, final User requestor) throws GameException {
    enforceGameCheck(game.isUserHost(requestor), "You are not the host of the game!");
    if (game.getTimer().isTimerRunning()) {
      game.getTimer().stop();
    }
    game.setTimer(setupTimer(TOTAL_ROUND_SECONDS, game.getId(), socketServer));
    triggerGameUpdateEvent(game);
  }

  @Override
  public void revealCardAssignment(final Game game, final User host, final CardKey card) throws GameException {
    enforceGameCheck(game.isUserHost(host), "You are not the host of the game!");
    List<User> users = game.getUserAssignmentForCard(card);
    enforceGameCheck(users.size() > 0, String.format("Card %s doesn't have a player assigned to it", card));
    for (User user : users) {
      game.permanentRevealUserCard(user);
    }
    triggerGameUpdateEvent(game);
  }

  @Override
  public void nominateLeader(final Game game, final RoomName roomName, final User nominator,
      final User nominee)
      throws GameException {
    Room room = game.getRoom(roomName);
    enforceGameCheck(room.isPlayerInRoom(nominator), "You are not in the correct room");
    enforceGameCheck(room.getLeader() == null, "Too late! A leader has already been nominated");

    room.setFirstLeader(nominee);
    sendEventToRoom(room, "NEW_LEADER", new LeaderChangeEvent(nominee, nominator, "First Leader Nomination"));
  }

  @Override
  public void nominateHostage(final Game game, final RoomName roomName, final User leader, final User hostage)
      throws GameException {
    Room room = game.getRoom(roomName);
    enforceGameCheck(room.isPlayerLeader(leader), "You are not the current leader");
    enforceGameCheck(!room.isPlayerLeader(hostage), "You can't nominate yourself to be a Hostage!");
    room.nominateHostage(hostage, game.getMaxHostages());
    sendEventToRoom(room, "HOSTAGE_UPDATE", room.getHostages());
  }

  @Override
  public void performHostageSwitch(final Game game, final User host) throws GameException {
    enforceGameCheck(game.getHost().is(host), "You are not the host of the game!");
    HostageSwitchService.performHostageSwitch(game);
  }

  @Override
  public void abdicateAsLeader(final Game game, final RoomName roomName, final User leader, final User replacement)
      throws GameException {
    Room room = game.getRoom(roomName);
    if (room.isPlayerLeader(leader)) {
      room.setReplacementLeader(replacement);
      replacement.sendEvent("ROOM_LEADER_OFFER", roomName);
    } else {
      throw new GameException("You are currently not the room leader!");
    }
  }

  @Override
  public void acceptLeadership(final Game game, final RoomName roomName, final User newLeader)
      throws GameException {
    Room room = game.getRoom(roomName);
    if (room.getReplacementLeader().is(newLeader) && game.getTimer().isTimerRunning()) {
      room.setReplacementLeader(null);
      room.setLeader(newLeader);
      sendEventToRoom(room, "LEADER_UPDATE", newLeader.getUserToken());
    } else {
      throw new GameException("You aren't currently the leaders nominee");
    }
  }

  @Override
  public void declineLeadership(final Game game, final RoomName roomName, final User decliner)
      throws GameException {
    Room room = game.getRoom(roomName);
    if (room.getReplacementLeader().is(decliner)) {
      room.setReplacementLeader(null);
      room.getReplacementLeader()
          .sendEvent("ABDICATE_DECLINED", decliner.getName() + " did not accept room leadership");
    }
  }

  @Override
  public void beginUsurp(final Game game, final RoomName roomName, final User usurper, final User leadershipNominee)
      throws GameException {
    Room room = game.getRoom(roomName);
    if (room.isPlayerInRoom(usurper) && room.isPlayerInRoom(leadershipNominee) && !room
        .isPlayerLeader(leadershipNominee)) {
      if (room.getUsurpAttempt() == null) {
        UsurpAttempt usurpAttempt = new UsurpAttempt(roomName, usurper, leadershipNominee,
            room.getPlayers(), getLeadershipVoteResolutionAction(game,this));
        room.setUsurpAttempt(usurpAttempt);
        sendEventToRoom(room, "USURP_ATTEMPT", usurpAttempt.getEvent());
        usurpAttempt.initiateUsurpVote();
      } else {
        throw new GameException("A usurp attempt is already in progress");
      }
    } else {
      throw new GameException("You can only usurp in your own room");
    }
  }

  @Override
  public void leadershipVote(final Game game, final RoomName roomName, final User voter, final LeadershipVote vote)
      throws GameException {
    Room room = game.getRoom(roomName);
    UsurpAttempt attempt = room.getUsurpAttempt();
    if (attempt != null) {
      attempt.registerVote(voter, vote);
    }
  }

  @Override
  public void resolveLeadershipVote(final Game game, final RoomName roomName, final LeadershipVote result) {
    Room room = game.getRoom(roomName);
    UsurpAttempt attempt = room.getUsurpAttempt();
    if (attempt != null) {
      if (result == LeadershipVote.YES) {
        room.setLeader(attempt.getNominee());
        sendEventToRoom(room, "USURP_ATTEMPT_SUCCESSFUL", attempt.getEvent());
      } else {
        sendEventToRoom(room, "USURP_ATTEMPT_FAILED", attempt.getEvent());
      }
      room.setUsurpAttempt(null);
    }
  }

  // Sharing Operations

  @Override
  public CardShareRequest requestShare(final Game game, final User requestor,
      final CardShareRequest request)
      throws GameException {
    if (game.getTimer().isTimerRunning()) {
      Optional<User> recipient = game.findPlayerByUserToken(request.getRecipient());
      if (recipient.isPresent()) {
        request.setId(UUID.randomUUID().toString());
        game.addShareRequest(request);
        try {
          userManager.sendEvent(recipient.get().getUserToken(), "SHARE_REQUEST_RECEIVED",
              request);
        } catch (UserException e) {
          throw new GameException(e.getMessage());
        }
        return request;
      } else {
        throw new GameException("Selected Player is not in the game");
      }
    } else {
      throw new GameException("Card shares are blocked whilst timer is not running");
    }
  }

  @Override
  public void privateReveal(final Game game, final User requestor, final CardShareRequest request)
      throws GameException {
    if (game.getTimer().isTimerRunning()) {
      Optional<User> user = game.findPlayerByUserToken(request.getRecipient());
      if (user.isPresent()) {
        sendCardDataToPlayer(game, request, user.get(), requestor);
      } else {
        throw new GameException(
            "Failed to accept Private Reveal. Requestor isn't currently online");
      }
    } else {
      throw new GameException("Reveals can only occur whilst the timer is running");
    }
  }

  @Override
  public void acceptShare(final Game game, final User recipient, final String requestId) throws GameException {
    CardShareRequest request = confirmIfShareAnswerIsAllowed(game, recipient, requestId);

    Optional<User> requestor = game.findPlayerByUserToken(request.getRequestor());
    if (requestor.isPresent()) {
      sendCardDataToPlayer(game, request, requestor.get(), recipient);
      sendCardDataToPlayer(game, request, recipient, requestor.get());
      game.invalidateCardShareRequest(request.getId());
    } else {
      throw new GameException(
          "Failed to accept Card Share. Requestor isn't currently online");
    }
  }

  @Override
  public void rejectShare(final Game game, final User recipient, final String requestId) throws GameException {
    CardShareRequest request = confirmIfShareAnswerIsAllowed(game, recipient, requestId);

    Optional<User> requestor = game.findPlayerByUserToken(request.getRequestor());
    if (requestor.isPresent()) {
      try {
        userManager.sendEvent(requestor.get().getUserToken(), "SHARE_REQUEST_REJECTED", request);
      } catch (UserException e) {
        throw new GameException(e.getMessage());
      }
    }

    game.invalidateCardShareRequest(request.getId());
  }

  private CardShareRequest confirmIfShareAnswerIsAllowed(Game game, User recipient, String requestId)
      throws GameException {
    if (game.getTimer().isTimerRunning()) {
      Optional<CardShareRequest> cardShareRequest = game.getCardShareRequest(requestId);
      if (cardShareRequest.isPresent() && cardShareRequest.get().getRecipient()
          .equals(recipient.getUserToken())) {
        return cardShareRequest.get();
      } else {
        throw new GameException("Card share request is no longer valid");
      }
    } else {
      throw new GameException(
          "Card Share Answers are only accepted whilst the timer is running...");
    }
  }

  private void sendCardDataToPlayer(final Game game, final CardShareRequest request, final User userToSend,
      final User cardOwner) throws GameException {
    CardRevealResponse event;
    Optional<Card> card = game.getRoleAssignmentForUser(cardOwner.getUserToken());

    if (card.isPresent()) {
      String eventName;
      if (request.getId() != null && !request.getId().isEmpty()) {
        eventName = "CARD_SHARE_ACCEPTED";
      } else {
        // We set a UUID here so that the frontend can reference this event properly
        request.setId(UUID.randomUUID().toString());
        eventName = "PRIVATE_REVEAL_RECEIVED";
      }

      if (request.getType() == CardShareType.ROLE) {
        event = CardRevealResponse.roleShare(request.getId(), cardOwner.getUserToken(), card.get());
      } else {
        event = CardRevealResponse
            .colourShare(request.getId(), cardOwner.getUserToken(), card.get());
      }

      try {
        userManager.sendEvent(userToSend.getUserToken(), eventName, event);
      } catch (UserException e) {
        throw new GameException(e.getMessage());
      }
    } else {
      throw new GameException("Failed to find role assignment for user");
    }
  }

  public void endGameAndCalculateResults(Game game) {
    game.setStage(GameStage.RESULTS);
    triggerGameUpdateEvent(game);
  }

  // Helper Methods

  private void triggerGameUpdateEvent(Game game) {
    sendEventToGame(game, "GAME_UPDATE", game);
  }

  private void sendEventToGame(Game game, String name, Object data) {
    socketServer.getRoomOperations("game/" + game.getId()).sendEvent(name, data);
  }

  private void sendEventToRoom(Room room, String name, Object data) {
    socketServer.getRoomOperations(room.getChannelName()).sendEvent(name, data);
  }

  private void addPlayerToGameComms(final User user, final Game game) {
    user.joinSocketRoom("game/" + game.getId());
    addPlayerToRoomComms(game, user);
  }

  private void addPlayerToRoomComms(final Game game, final User user) {
    if (game.getStage() != GameStage.CREATED) {
      Optional<Room> roomFind = game.findRoomUserIsIn(user);
      if (roomFind.isPresent()) {
        user.sendEvent("JOIN_ROOM",
            new JoinRoomEvent(roomFind.get(), "Reconnection"));
        user.joinSocketRoom(roomFind.get().getChannelName());
      }
    }
  }

  private void reloadPlayerGameData(final Game game, final User user)
      throws UserException {
    if (game.hasStarted()) {
      userManager.sendEvent(user.getUserToken(), "CARD_UPDATE",
          game.getRoleAssignmentForUser(user.getUserToken()).get());
    }
  }

  private void enforceGameCheck(final boolean conditionMet, final String exceptionMessage)
      throws GameException {
    if (!conditionMet) {
      throw new GameException(exceptionMessage);
    }
  }

  public PostRoomVoteAction getLeadershipVoteResolutionAction(Game game, GameEngine gameEngine) {
    return new PostRoomVoteAction() {
      @Override
      public void success(RoomName roomName) {
        gameEngine.resolveLeadershipVote(game, roomName, LeadershipVote.YES);
      }

      @Override
      public void failure(RoomName roomName) {
        gameEngine.resolveLeadershipVote(game, roomName, LeadershipVote.NO);
      }
    };
  }
}
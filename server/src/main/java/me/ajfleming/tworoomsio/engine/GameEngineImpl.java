package me.ajfleming.tworoomsio.engine;

import static me.ajfleming.tworoomsio.timer.TimerUtils.setupTimer;

import com.corundumstudio.socketio.SocketIOServer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.exception.UserException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.RoundMap;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
import me.ajfleming.tworoomsio.service.deck.DeckDealerService;
import me.ajfleming.tworoomsio.service.lobby.JoinCodeGenerator;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.CardShareType;
import me.ajfleming.tworoomsio.socket.response.CardRevealResponse;
import me.ajfleming.tworoomsio.storage.GameCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GameEngineImpl implements GameEngine {

  private static final int TOTAL_ROUND_SECONDS = 180;
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
      Game game = Game.builder()
          .newGame(hostUser, joinCodeGenerator.generateJoinCode())
          .build();
      return game;
  }

  @Override
  public void joinGame(final Game game, final User player) throws GameException {
    if (game.getRound() > 0) {
      throw new GameException("Game has already started");
    }

    if (game.findPlayer(player.getName()).isPresent()) {
      throw new GameException(
          "Someone has already used that name! Maybe you have a popular name like Andrew? 🤔");
    }

    game.addPlayer(player);
    addPlayerToGameComms(player, game);
    game.setDeck(deckBuilder.buildDeck(game.getTotalPlayerCount()));
    triggerGameUpdateEvent(game);
  }

  @Override
  public void reloadPlayerIntoGame(Game game, User player)
      throws GameException {
    if (!game.reconnectPlayer(player)) {
      throw new GameException("Failed to reconnect to game");
    }
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

  private void startGame(final Game game, final User requestor) throws GameException {
    if (isGameReadyToStart(game) && game.isUserHost(requestor)) {
      game.nextRound();
      game.setRoundData(RoundMap.getRoundData(game.getTotalPlayerCount()));
      game.setCardAssignments(DeckDealerService.dealDeck(game.getDeck(), game.getPlayers()));
      game.setTimer(setupTimer(TOTAL_ROUND_SECONDS, game.getId(), socketServer));
      triggerGameUpdateEvent(game);
    }
  }

  private boolean isGameReadyToStart(Game game) {
    return game.getDeck().size() == game.getPlayers().size();
  }

  @Override
  public void nextRound(Game game, User requestor) throws GameException {
    if (game.isUserHost(requestor)) {
      if (game.getRound() == 0) {
        startGame(game, requestor);
      } else {
        game.nextRound();
        game.setTimer(setupTimer(TOTAL_ROUND_SECONDS, game.getId(), socketServer));
      }
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
    if (game.isUserHost(requestor)) {
      game.getTimer().start();
    }
  }

  @Override
  public void pauseTimer(final Game game, final User requestor) {
    if (game.isUserHost(requestor)) {
      game.getTimer().stop();
    }

  }

  @Override
  public void restartTimer(final Game game, final User requestor) {
    if (game.isUserHost(requestor)) {
      if (game.getTimer().isTimerRunning()) {
        game.getTimer().stop();
      }

      game.setTimer(setupTimer(TOTAL_ROUND_SECONDS, game.getId(), socketServer));
    }
    triggerGameUpdateEvent(game);
  }

  @Override
  public void revealCardAssignment(final Game game, final User host, final CardKey card) throws GameException {
    if (game.isUserHost(host)) {
      List<User> users = game.getUserAssignmentForCard(card);
      if (users.size() > 0) {
        for (User user : users) {
          game.permanentRevealUserCard(user);
        }
      } else {
        throw new GameException(
            String.format("Card %s doesn't have a player assigned to it", card));
      }
    }
    triggerGameUpdateEvent(game);
  }

  // Sharing Operations

  @Override
  public CardShareRequest requestShare(final Game game, final User requestor, final CardShareRequest request)
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

  // Helper Methods

  private void triggerGameUpdateEvent(Game game) {
    sendEventToGame(game,"GAME_UPDATE", game);
  }

  private void sendEventToGame(Game game, String name, Object data) {
    socketServer.getRoomOperations("game/" + game.getId()).sendEvent(name, data);
  }

  private void addPlayerToGameComms(final User user, final Game game) {
    user.getClient().joinRoom("game/" + game.getId());
  }

  private void reloadPlayerGameData(final Game game, final User user)
      throws UserException {
    if (game.hasStarted()) {
      userManager.sendEvent(user.getUserToken(), "CARD_UPDATE",
          game.getRoleAssignmentForUser(user.getUserToken()).get());
    }
  }
}

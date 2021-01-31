package me.ajfleming.tworoomsio.controller;

import java.net.Socket;
import java.util.Optional;

import com.corundumstudio.socketio.SocketIOClient;

import me.ajfleming.tworoomsio.engine.GameEngine;
import me.ajfleming.tworoomsio.engine.UserManager;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.socket.action.VoteAction;
import me.ajfleming.tworoomsio.socket.action.NominateAction;
import me.ajfleming.tworoomsio.socket.event.ReloadGameSessionEvent;
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse;
import me.ajfleming.tworoomsio.socket.response.RequestShareResponse;
import me.ajfleming.tworoomsio.socket.response.Response;
import me.ajfleming.tworoomsio.storage.GameCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserActionController {

  private final GameEngine gameEngine;
  private final GameCache gameCache;
  private final UserManager userManager;

  @Autowired
  public UserActionController(GameEngine gameEngine, GameCache gameCache, UserManager userManager) {
    this.gameEngine = gameEngine;
    this.gameCache = gameCache;
    this.userManager = userManager;
  }

  public void createGame(SocketIOClient client, String name) {
    User user = userManager.createUser(client, name);

    try {
      Game game = gameEngine.createNewGame(user);
      gameCache.addGame(game);
      gameEngine.joinGame(game, user);
      client.sendEvent("JOIN_GAME_SUCCESS",
          new JoinGameResponse(game.getId(), user.getUserToken(), user.getUserSecret()));
    } catch (GameException e) {
      client.sendEvent("CREATE_GAME_ERROR", Response.error(e.getMessage()));
    }
  }

  public void joinGame(SocketIOClient client, String name, String joinGameCode) {
    User user = userManager.createUser(client, name);
    try {
      Game game = gameCache.getGameByJoinCode(joinGameCode);
      gameEngine.joinGame(game, user);
      client.sendEvent("JOIN_GAME_SUCCESS",
          new JoinGameResponse(game.getId(), user.getUserToken(), user.getUserSecret()));
    } catch (GameException e) {
      client.sendEvent("JOIN_GAME_ERROR", Response.error(e.getMessage()));
    }
  }

  public void endRound(SocketIOClient client, String gameId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.endRound(game, requestor);
      } catch (GameException e) {
        client.sendEvent("END_ROUND_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void reloadGameSession(final SocketIOClient client, final ReloadGameSessionEvent event) {
    Optional<User> user = userManager.reconnectDisconnectedUser(client, event);

    if (user.isPresent()) {
      try {
        Game game = gameCache.getGame(event.getGameId());
        gameEngine.reloadPlayerIntoGame(game, user.get());
        client.sendEvent("RELOAD_GAME_SESSION_SUCCESS",
            new JoinGameResponse(event.getGameId(), event.getPlayerToken(),
                event.getPlayerSecret()));
      } catch (GameException e) {
        client.sendEvent("RELOAD_GAME_SESSION_ERROR", Response.error(e.getMessage()));
      }
    } else {
      client.sendEvent("RELOAD_GAME_SESSION_ERROR",
          Response.error("Failed to reconnect user"));
    }
  }

  public void disconnectPlayer(SocketIOClient client) {
    userManager.handleDisconnectedClient(client).ifPresent(gameEngine::disconnectPlayer);
  }

  public void startNextRound(final SocketIOClient client, String gameId) {
   userManager.getUser(client).ifPresent(user ->  {
     try {
       Game game = gameCache.getGame(gameId);
       gameEngine.nextRound(game, user);
     } catch (GameException e) {
       client.sendEvent("START_NEXT_ROUND_ERROR", Response.error(e.getMessage()));
     }
   });
  }

  public void startGameTimer(final SocketIOClient client, String gameId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.startTimer(game, requestor);
      } catch (GameException e) {
        client.sendEvent("START_TIMER_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void pauseGameTimer(final SocketIOClient client, String gameId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.pauseTimer(game, requestor);
      } catch (GameException e) {
        client.sendEvent("PAUSE_TIMER_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void restartGameTimer(final SocketIOClient client, String gameId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.restartTimer(game, requestor);
      } catch (GameException e) {
        client.sendEvent("RESTART_TIMER_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void revealCardAssignment(final SocketIOClient client, final String gameId, final CardKey card) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.revealCardAssignment(game, requestor, card);
      } catch (GameException e) {
        client.sendEvent("REVEAL_CARD_ASSIGNMENT_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void requestShare(SocketIOClient client, CardShareRequest request) {
    userManager.getUser(client).ifPresent(requestor -> {
      request.setRequestor(requestor.getUserToken());
      try {
        Game game = gameCache.getGame(request.getGameId());
        CardShareRequest approvedRequest = gameEngine.requestShare(game, requestor, request);
        client.sendEvent("REQUEST_SHARE_SUCCESS", approvedRequest);
      } catch (GameException e) {
        client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void acceptShare(SocketIOClient client, String gameId, String requestId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.acceptShare(game, requestor, requestId);
      } catch (GameException e) {
        client.sendEvent("ANSWER_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void rejectShare(SocketIOClient client, String gameId, String requestId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(gameId);
        gameEngine.rejectShare(game, requestor, requestId);
        client.sendEvent("REJECT_SHARE_SUCCESS", new RequestShareResponse(requestId));
      } catch (GameException e) {
        client.sendEvent("ANSWER_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void privateReveal(SocketIOClient client, CardShareRequest request) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(request.getGameId());
        gameEngine.privateReveal(game, requestor, request);
      } catch (GameException e) {
        client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  // Room Actions
  public void nominateHostage( final SocketIOClient client, NominateAction action ) {
    userManager.getUser(client).ifPresent(requestor ->
        userManager.findConnectedUserByPlayerId(action.getNominee()).ifPresent(nominee -> {
          try {
            Game game = gameCache.getGame(action.getGameId());
            gameEngine.nominateHostage(game, action.getRoom(), requestor, nominee);
          } catch (GameException e) {
            client.sendEvent("NOMINATE_HOSTAGE_ERROR", e.getMessage() );
          }
      })
    );
  }

  public void nominateLeader( final SocketIOClient client, NominateAction action ) {
    userManager.getUser(client).ifPresent(requestor ->
        userManager.findConnectedUserByPlayerId(action.getNominee()).ifPresent(nominee -> {
          try {
            Game game = gameCache.getGame(action.getGameId());
            gameEngine.nominateLeader(game, action.getRoom(), requestor, nominee);
          } catch (GameException e) {
            client.sendEvent("NOMINATE_LEADER_ERROR", e.getMessage() );
          }
        })
    );
  }

  public void abdicateAsLeader(final SocketIOClient client, NominateAction action) {
    userManager.getUser(client).ifPresent(requestor ->
        userManager.findConnectedUserByPlayerId(action.getNominee()).ifPresent(nominee -> {
          try {
            Game game = gameCache.getGame(action.getGameId());
            gameEngine.abdicateAsLeader(game, action.getRoom(), requestor, nominee);
          } catch ( GameException e ) {
            client.sendEvent("ABDICATE_LEADER_ERROR", e.getMessage() );
          }
      })
    );
  }

  public void answerLeadershipOffer(final SocketIOClient client, VoteAction action) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(action.getGameId());
        if (action.getVote() == LeadershipVote.YES) {
          gameEngine.acceptLeadership(game, action.getRoom(), requestor);
        } else {
          gameEngine.declineLeadership(game, action.getRoom(), requestor);
        }
      } catch (GameException e) {
        client.sendEvent("ANSWER_LEADERSHIP_OFFER_ERROR", e.getMessage());
      }
    });
  }

  public void usurpLeader( final SocketIOClient client, NominateAction action ) {
    userManager.getUser(client).ifPresent(requestor ->
      userManager.findConnectedUserByPlayerId(action.getNominee()).ifPresent(nominee -> {
        try {
          Game game = gameCache.getGame(action.getGameId());
          gameEngine.beginUsurp(game, action.getRoom(), requestor, nominee);
        } catch ( GameException e ) {
          client.sendEvent("USURP_LEADER_ERROR", e.getMessage() );
        }
    }));
  }

  public void usurpVote( final SocketIOClient client, VoteAction action ) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        Game game = gameCache.getGame(action.getGameId());
        gameEngine.leadershipVote(game, action.getRoom(), requestor, action.getVote());
      } catch ( GameException e ) {
        client.sendEvent("USURP_VOTE_ERROR", e.getMessage() );
      }
    });
  }
}
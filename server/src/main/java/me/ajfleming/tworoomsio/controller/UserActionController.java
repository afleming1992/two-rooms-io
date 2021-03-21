package me.ajfleming.tworoomsio.controller;

import com.corundumstudio.socketio.SocketIOClient;
import java.util.Optional;
import me.ajfleming.tworoomsio.engine.GameEngine;
import me.ajfleming.tworoomsio.engine.UserManager;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
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
}

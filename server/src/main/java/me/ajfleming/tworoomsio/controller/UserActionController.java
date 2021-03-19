package me.ajfleming.tworoomsio.controller;

import com.corundumstudio.socketio.SocketIOClient;
import java.util.Optional;
import me.ajfleming.tworoomsio.engine.GameEngine;
import me.ajfleming.tworoomsio.engine.UserManager;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.socket.event.ReloadGameSessionEvent;
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse;
import me.ajfleming.tworoomsio.socket.response.RequestShareResponse;
import me.ajfleming.tworoomsio.socket.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserActionController {

  private final GameEngine gameEngine;
  private final UserManager userManager;

  @Autowired
  public UserActionController(GameEngine gameEngine, UserManager userManager) {
    this.gameEngine = gameEngine;
    this.userManager = userManager;
  }

  public void joinGame(SocketIOClient client, String name) {
    User user = userManager.createUser(client, name);

    try {
      String gameId = gameEngine.addPlayerToGame(user);
      client.sendEvent("JOIN_GAME_SUCCESS",
          new JoinGameResponse(gameId, user.getUserToken(), user.getUserSecret()));
    } catch (GameException e) {
      client.sendEvent("JOIN_GAME_ERROR", Response.error(e.getMessage()));
    }
  }

  public void reloadGameSession(final SocketIOClient client, final ReloadGameSessionEvent event) {
    Optional<User> user = userManager.reconnectDisconnectedUser(client, event);

    if (user.isPresent()) {
      try {
        gameEngine.reloadPlayerIntoGame(event.getGameToken(), user.get());
        client.sendEvent("RELOAD_GAME_SESSION_SUCCESS",
            new JoinGameResponse(event.getGameToken(), event.getPlayerToken(),
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
    userManager.handleDisconnectedClient(client).ifPresent(user -> {
        try {
          gameEngine.disconnectPlayer(user);
        } catch (GameException e) {
          client.sendEvent("DISCONNECT_ERROR", Response.error(e.getMessage()));
        }
    });
  }

  public void startNextRound(final SocketIOClient client) {
   userManager.getUser(client).ifPresent(user ->  {
     try {
       gameEngine.nextRound(user);
     } catch (GameException e) {
       client.sendEvent("START_NEXT_ROUND_ERROR", Response.error(e.getMessage()));
     }
   });
  }

  public void startGameTimer(final SocketIOClient client) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.startTimer(requestor);
      } catch (GameException e) {
        client.sendEvent("START_TIMER_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void pauseGameTimer(final SocketIOClient client) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.pauseTimer(requestor);
      } catch (GameException e) {
        client.sendEvent("PAUSE_TIMER_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void restartGameTimer(final SocketIOClient client) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.restartTimer(requestor);
      } catch (GameException e) {
        client.sendEvent("RESTART_TIMER_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void revealCardAssignment(final SocketIOClient client, final CardKey card) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.revealCardAssignment(requestor, card);
      } catch (GameException e) {
        client.sendEvent("REVEAL_CARD_ASSIGNMENT_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void requestShare(final SocketIOClient client, CardShareRequest request) {
    userManager.getUser(client).ifPresent(requestor -> {
      request.setRequestor(requestor.getUserToken());
      try {
        CardShareRequest approvedRequest = gameEngine.requestShare(requestor, request);
        client.sendEvent("REQUEST_SHARE_SUCCESS", approvedRequest);
      } catch (GameException e) {
        client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void acceptShare(final SocketIOClient client, String requestId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.acceptShare(requestor, requestId);
      } catch (GameException e) {
        client.sendEvent("ANSWER_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void rejectShare(final SocketIOClient client, String requestId) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.rejectShare(requestor, requestId);
        client.sendEvent("REJECT_SHARE_SUCCESS", new RequestShareResponse(requestId));
      } catch (GameException e) {
        client.sendEvent("ANSWER_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }

  public void privateReveal(final SocketIOClient client, CardShareRequest request) {
    userManager.getUser(client).ifPresent(requestor -> {
      try {
        gameEngine.privateReveal(requestor, request);
      } catch (GameException e) {
        client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.getMessage()));
      }
    });
  }
}

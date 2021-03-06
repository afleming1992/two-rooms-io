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

public class UserActionController {

  private GameEngine gameEngine;
  private UserManager userManager;

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
      return;
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
    Optional<User> disconnectingUser = userManager.handleDisconnectedClient(client);

    if (disconnectingUser.isPresent()) {
      gameEngine.disconnectPlayer(disconnectingUser.get());
    }
  }

  public void startNextRound(final SocketIOClient client) {
    Optional<User> user = userManager.getUser(client);

    if (user.isPresent()) {
      try {
        gameEngine.nextRound(user.get());
      } catch (GameException e) {
        client.sendEvent("START_ERROR", Response.error(e.getMessage()));
      }
    }
  }

  public void startGameTimer(final SocketIOClient client) {
    Optional<User> user = userManager.getUser(client);

    if (user.isPresent()) {
      gameEngine.startTimer(user.get());
    }
  }

  public void pauseGameTimer(final SocketIOClient client) {
    Optional<User> user = userManager.getUser(client);

    if (user.isPresent()) {
      gameEngine.pauseTimer(user.get());
    }
  }

  public void restartGameTimer(final SocketIOClient client) {
    Optional<User> user = userManager.getUser(client);

    if (user.isPresent()) {
      gameEngine.restartTimer(user.get());
    }
  }


  public void revealCardAssignment(final SocketIOClient client, final CardKey card) {
    Optional<User> user = userManager.getUser(client);

    if (user.isPresent()) {
      try {
        gameEngine.revealCardAssignment(user.get(), card);
      } catch (GameException e) {
        client.sendEvent("REVEAL_CARD_ASSIGNMENT_ERROR", Response.error(e.getMessage()));
      }
    }
  }

  public void requestShare(final SocketIOClient client, CardShareRequest request) {
    Optional<User> requestor = userManager.getUser(client);
    if (requestor.isPresent()) {
      request.setRequestor(requestor.get().getUserToken());
      try {
        CardShareRequest approvedRequest = gameEngine.requestShare(requestor.get(), request);
        client.sendEvent("REQUEST_SHARE_SUCCESS", approvedRequest);
      } catch (GameException e) {
        client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.getMessage()));
      }
    }
  }

  public void acceptShare(final SocketIOClient client, String requestId) {
    Optional<User> requestor = userManager.getUser(client);
    if (requestor.isPresent()) {
      try {
        gameEngine.acceptShare(requestor.get(), requestId);
      } catch (GameException e) {
        client.sendEvent("ANSWER_SHARE_ERROR", Response.error(e.getMessage()));
      }
    }
  }

  public void rejectShare(final SocketIOClient client, String requestId) {
    Optional<User> requestor = userManager.getUser(client);
    if (requestor.isPresent()) {
      try {
        gameEngine.rejectShare(requestor.get(), requestId);
        client.sendEvent("REJECT_SHARE_SUCCESS", new RequestShareResponse(requestId));
      } catch (GameException e) {
        client.sendEvent("ANSWER_SHARE_ERROR", Response.error(e.getMessage()));
      }
    }
  }

  public void privateReveal(final SocketIOClient client, CardShareRequest request) {
    Optional<User> requestor = userManager.getUser(client);
    if (requestor.isPresent()) {
      try {
        gameEngine.privateReveal(requestor.get(), request);
      } catch (GameException e) {
        client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.getMessage()));
      }
    }
  }
}

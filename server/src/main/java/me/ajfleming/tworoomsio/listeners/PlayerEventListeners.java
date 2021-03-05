package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.socket.event.JoinGameEvent;
import me.ajfleming.tworoomsio.socket.event.ReloadGameSessionEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequiredArgsConstructor
public class PlayerEventListeners {

  private static final Logger LOGGER = LoggerFactory.getLogger(PlayerEventListeners.class);

  private final UserActionController userActionController;

  @OnConnect
  public void onConnect(SocketIOClient client) {
    LOGGER.info("Client Connected - " + client.getSessionId().toString());
  }

  @OnEvent("RELOAD_GAME_SESSION")
  public void onReloadGameSession(SocketIOClient client, ReloadGameSessionEvent event) {
    LOGGER.info("Client is reloading a game session - " + client.getSessionId().toString());
    userActionController.reloadGameSession(client, event);
  }

  @OnEvent("JOIN_GAME")
  public void onJoinGame(SocketIOClient client, JoinGameEvent event) {
    LOGGER.info("Client joined Game - " + client.getSessionId().toString());
    userActionController.joinGame(client, event.getName());
  }

  @OnDisconnect
  public void onDisconnect(SocketIOClient client) {
    LOGGER.info("Client Disconnected - " + client.getSessionId().toString());
    userActionController.disconnectPlayer(client);
  }
}

package me.ajfleming.tworoomsio;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketConfig;
import com.corundumstudio.socketio.SocketIOServer;
import me.ajfleming.tworoomsio.controller.AdminActionController;
import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.engine.GameEngine;
import me.ajfleming.tworoomsio.engine.GameEngineImpl;
import me.ajfleming.tworoomsio.engine.UserManager;
import me.ajfleming.tworoomsio.listeners.CardRequestListeners;
import me.ajfleming.tworoomsio.listeners.DevModeListeners;
import me.ajfleming.tworoomsio.listeners.HostEventListeners;
import me.ajfleming.tworoomsio.listeners.PlayerEventListeners;
import me.ajfleming.tworoomsio.listeners.RoomEventListeners;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TwoRoomsIoApplication {

  private static final Logger LOGGER = LoggerFactory.getLogger(TwoRoomsIoApplication.class);
  //TODO: Change this to configurable outside of Code
  private static final boolean DEV_MODE = true;

  public static void main(String[] args) {
    Configuration config = new Configuration();
    config.setPort(3001);

    SocketConfig socketConfig = new SocketConfig();
    socketConfig.setReuseAddress(true);
    config.setSocketConfig(socketConfig);

    final SocketIOServer server = new SocketIOServer(config);
    final UserManager userManager = new UserManager();

    final GameEngine gameEngine = new GameEngineImpl(server, userManager);
    final UserActionController userActionController = new UserActionController(gameEngine,
        userManager);
    final AdminActionController adminActionController = new AdminActionController(gameEngine, userManager);

    final PlayerEventListeners playerEventListeners = new PlayerEventListeners(
        userActionController);
    final HostEventListeners hostEventListeners = new HostEventListeners(userActionController);
    final CardRequestListeners cardRequestListeners = new CardRequestListeners(
        userActionController);
    final RoomEventListeners roomEventListeners = new RoomEventListeners(userActionController);

    server.addListeners(playerEventListeners);
    server.addListeners(hostEventListeners);
    server.addListeners(cardRequestListeners);
    server.addListeners(roomEventListeners);

    if (DEV_MODE) {
      final DevModeListeners devModeListeners = new DevModeListeners(adminActionController);
      server.addListeners(devModeListeners);
    }

    server.start();
  }
}

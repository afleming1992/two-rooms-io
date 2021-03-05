package me.ajfleming.tworoomsio;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketConfig;
import com.corundumstudio.socketio.SocketIOServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TwoRoomsIoApplication {

  private static final Logger LOGGER = LoggerFactory.getLogger(TwoRoomsIoApplication.class);
  //TODO: Change this to configurable outside of Code
  private static final boolean DEV_MODE = true;

  public static void main(String[] args) {
    SpringApplication.run(TwoRoomsIoApplication.class, args);
  }

  @Bean
  public Configuration socketIoConfig() {
    Configuration config = new Configuration();
    config.setPort(3001);

    SocketConfig socketConfig = new SocketConfig();
    socketConfig.setReuseAddress(true);
    config.setSocketConfig(socketConfig);

    return config;
  }

  @Bean
  public SocketIOServer server(Configuration configuration) {
    return new SocketIOServer(configuration);
  }
}

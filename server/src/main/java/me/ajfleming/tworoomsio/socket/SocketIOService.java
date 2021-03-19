package me.ajfleming.tworoomsio.socket;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import java.util.List;
import javax.annotation.PostConstruct;
import lombok.Getter;
import me.ajfleming.tworoomsio.listeners.RequestListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

@Component
public class SocketIOService implements ApplicationListener<ContextClosedEvent> {

  private final SocketIOServer server;
  private final List<RequestListener> requestListeners;

  @Autowired
  public SocketIOService(SocketIOServer server, List<RequestListener> requestListeners) {
    this.server = server;
    this.requestListeners = requestListeners;
  }

  @PostConstruct
  public void init() {
    this.start();
  }

  @Override
  public void onApplicationEvent(ContextClosedEvent contextClosedEvent) {
    this.shutdown();
  }

  public void setupListeners() {
    for(RequestListener listener : requestListeners) {
      server.addListeners(listener);
    }
  }

  public void start() {
    this.setupListeners();
    server.start();
  }

  public void shutdown() {
    server.stop();
  }
}

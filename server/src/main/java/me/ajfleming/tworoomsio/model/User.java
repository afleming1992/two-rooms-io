package me.ajfleming.tworoomsio.model;

import com.corundumstudio.socketio.SocketIOClient;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.UUID;
import lombok.Data;

@Data
public class User {

  private String userToken;
  private String name;
  @JsonIgnore
  private final String userSecret;
  @JsonIgnore
  private SocketIOClient client;
  @JsonIgnore
  private boolean connected;

  public User(String name, SocketIOClient client) {
    userToken = UUID.randomUUID().toString();
    userSecret = UUID.randomUUID().toString();
    this.name = name;
    this.client = client;
    connected = true;
  }

  public boolean authenticateUser(String userToken, String userSecret) {
    return this.userToken.equals(userToken) && this.userSecret.equals(userSecret);
  }

  public void sendEvent(String eventName, Object payload) {
    client.sendEvent(eventName, payload);
  }

  public void disconnectPlayer() {
    this.connected = false;
  }

  public void reconnectPlayer(SocketIOClient client) {
    this.client = client;
    this.connected = true;
  }

  public boolean is(User user) {
    return getUserToken().equals(user.getUserToken());
  }

  @JsonIgnore
  public UUID getSocketSessionId() {
    return this.getClient().getSessionId();
  }
}

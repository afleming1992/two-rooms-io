package me.ajfleming.tworoomsio.socket.event;

import lombok.Data;

@Data
public class ReloadGameSessionEvent {
  private String gameToken;
  private String playerToken;
  private String playerSecret;
}

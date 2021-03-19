package me.ajfleming.tworoomsio.socket.event;

import lombok.Data;

@Data
public class ReloadGameSessionEvent {
  private String gameId;
  private String playerToken;
  private String playerSecret;
}

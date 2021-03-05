package me.ajfleming.tworoomsio.socket.event;

import lombok.Value;

@Value
public class ReloadGameSessionEvent {
  String gameToken;
  String playerToken;
  String playerSecret;
}

package me.ajfleming.tworoomsio.socket.event;

import lombok.Data;

@Data
public class JoinGameEvent {
  private String joinGameCode;
  private String name;
}

package me.ajfleming.tworoomsio.socket.event;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JoinGameEvent {
  private String joinGameCode;
  private String name;
}

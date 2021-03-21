package me.ajfleming.tworoomsio.socket.event;

import lombok.Data;
import me.ajfleming.tworoomsio.model.CardKey;

@Data
public class RevealPlayerAssignmentEvent {
  private String gameId;
  private CardKey card;
}

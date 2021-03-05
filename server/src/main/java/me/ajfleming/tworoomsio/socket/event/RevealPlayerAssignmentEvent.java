package me.ajfleming.tworoomsio.socket.event;

import lombok.Value;
import me.ajfleming.tworoomsio.model.CardKey;

@Value
public class RevealPlayerAssignmentEvent {
  CardKey card;
}

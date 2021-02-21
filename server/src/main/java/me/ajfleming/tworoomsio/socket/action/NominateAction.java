package me.ajfleming.tworoomsio.socket.action;

import lombok.Data;
import me.ajfleming.tworoomsio.model.room.RoomName;

@Data
public class NominateAction {
  String gameId;
  RoomName room;
  String nominee;
}
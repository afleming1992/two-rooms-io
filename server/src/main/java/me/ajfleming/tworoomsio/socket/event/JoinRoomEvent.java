package me.ajfleming.tworoomsio.socket.event;

import java.util.List;
import lombok.Data;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

@Data
public class JoinRoomEvent {

  RoomName room;
  User currentLeader;
  List<User> hostages;
  User user;
  String reasonForJoin;

  public JoinRoomEvent(Room room, String reasonForJoin) {
    this.room = room.getRoomName();
    this.currentLeader = room.getLeader();
    this.hostages = room.getHostages();
    this.user = null;
    this.reasonForJoin = reasonForJoin;
  }
}

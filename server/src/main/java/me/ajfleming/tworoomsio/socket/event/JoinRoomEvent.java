package me.ajfleming.tworoomsio.socket.event;

import java.util.List;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

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

  public RoomName getRoom() {
    return room;
  }

  public void setRoom(final RoomName room) {
    this.room = room;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getReasonForJoin() {
    return reasonForJoin;
  }

  public void setReasonForJoin(final String reasonForJoin) {
    this.reasonForJoin = reasonForJoin;
  }
}

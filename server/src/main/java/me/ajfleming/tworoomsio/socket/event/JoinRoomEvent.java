package me.ajfleming.tworoomsio.socket.event;

import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class JoinRoomEvent {

  RoomName room;
  User user;
  String reasonForJoin;

  public JoinRoomEvent(RoomName room, String reasonForJoin) {
    this.room = room;
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

package me.ajfleming.tworoomsio.model.room;

import java.util.List;
import me.ajfleming.tworoomsio.model.User;

public class Room {

  private RoomName roomName;
  private List<User> players;
  private User leader;

  public RoomName getRoomName() {
    return roomName;
  }

  public void setRoomName(final RoomName roomName) {
    this.roomName = roomName;
  }

  public List<User> getPlayers() {
    return players;
  }

  public void setPlayers(final List<User> players) {
    this.players = players;
  }

  public User getLeader() {
    return leader;
  }

  public void setLeader(final User leader) {
    this.leader = leader;
  }
}

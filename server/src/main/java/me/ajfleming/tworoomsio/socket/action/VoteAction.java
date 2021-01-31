package me.ajfleming.tworoomsio.socket.action;

import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class VoteAction {
  RoomName room;
  LeadershipVote vote;

  public RoomName getRoom() {
    return room;
  }

  public void setRoom(final RoomName room) {
    this.room = room;
  }

  public LeadershipVote getVote() {
    return vote;
  }

  public void setAnswer( final LeadershipVote answer ) {
    this.vote = vote;
  }
}

package me.ajfleming.tworoomsio.socket.action;

import lombok.Data;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;

@Data
public class VoteAction {
  String gameId;
  RoomName room;
  LeadershipVote vote;
}

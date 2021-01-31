package me.ajfleming.tworoomsio.actions;

import me.ajfleming.tworoomsio.model.room.RoomName;

public interface PostRoomVoteAction {

  void success(RoomName roomName);

  void failure(RoomName roomName);
}

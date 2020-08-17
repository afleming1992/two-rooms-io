package me.ajfleming.tworoomsio.timer;

import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;

public interface UsurpResolve {
	public void resolveUsurpVote( RoomName roomName, LeadershipVote resolve );
}

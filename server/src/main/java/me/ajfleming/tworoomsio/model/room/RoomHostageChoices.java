package me.ajfleming.tworoomsio.model.room;

import java.util.List;

import me.ajfleming.tworoomsio.model.User;

public class RoomHostageChoices {

	private final RoomName room;
	private final User leader;
	private final List<User> hostages;

	public RoomHostageChoices( Room room ) {
		this.room = room.getRoomName();
		this.leader = room.getLeader();
		this.hostages = room.getHostages();
	}

	public RoomName getRoom() {
		return room;
	}

	public User getLeader() {
		return leader;
	}

	public List<User> getHostages() {
		return hostages;
	}
}

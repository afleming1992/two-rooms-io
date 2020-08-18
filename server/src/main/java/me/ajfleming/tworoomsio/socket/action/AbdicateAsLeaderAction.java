package me.ajfleming.tworoomsio.socket.action;

import me.ajfleming.tworoomsio.model.room.RoomName;

public class AbdicateAsLeaderAction {
	RoomName room;
	String replacementNominee;

	public RoomName getRoom() {
		return room;
	}

	public void setRoom( final RoomName room ) {
		this.room = room;
	}

	public String getReplacementNominee() {
		return replacementNominee;
	}

	public void setReplacementNominee( final String replacementNominee ) {
		this.replacementNominee = replacementNominee;
	}
}

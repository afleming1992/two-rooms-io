package me.ajfleming.tworoomsio.socket.action;

import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class NominateAction {
	RoomName room;
	String nominee;

	public RoomName getRoom() {
		return room;
	}

	public void setRoom( final RoomName room ) {
		this.room = room;
	}

	public String getNominee() {
		return nominee;
	}

	public void setNominee( final String nominee ) {
		this.nominee = nominee;
	}
}

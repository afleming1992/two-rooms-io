package me.ajfleming.tworoomsio.socket.event;

import me.ajfleming.tworoomsio.model.room.RoomName;

public class JoinRoomEvent {
	RoomName room;
	String reasonForJoin;

	public JoinRoomEvent( RoomName room, String reasonForJoin ) {
		this.room = room;
		this.reasonForJoin = reasonForJoin;
	}

	public RoomName getRoom() {
		return room;
	}

	public void setRoom( final RoomName room ) {
		this.room = room;
	}

	public String getReasonForJoin() {
		return reasonForJoin;
	}

	public void setReasonForJoin( final String reasonForJoin ) {
		this.reasonForJoin = reasonForJoin;
	}
}

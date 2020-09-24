package me.ajfleming.tworoomsio.socket.event;

import java.util.HashMap;
import java.util.Map;

import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomHostageChoices;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class ShowHostagesEvent {
	Map<RoomName, RoomHostageChoices> rooms;

	public ShowHostagesEvent( Map<RoomName, Room> rooms ) {
		this.rooms = new HashMap<>();

		for ( Room room : rooms.values() ) {
			this.rooms.put( room.getRoomName(), new RoomHostageChoices( room ) );
		}
	}

	public Map<RoomName, RoomHostageChoices> getRooms() {
		return rooms;
	}

	public void setRooms( final Map<RoomName, RoomHostageChoices> rooms ) {
		this.rooms = rooms;
	}
}

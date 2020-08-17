package me.ajfleming.tworoomsio.socket.event;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class ShowHostagesEvent {
	Map<RoomName, List<String>> hostages;

	public ShowHostagesEvent( Map<RoomName, Room> rooms ) {
		hostages = new HashMap<>();

		for ( Room room : rooms.values() ) {
			hostages.put( room.getRoomName(), room.getHostages()
					.stream()
					.map( User::getUserToken )
					.collect( Collectors.toList() ) );
		}
	}

	public Map<RoomName, List<String>> getHostages() {
		return hostages;
	}

	public void setHostages( final Map<RoomName, List<String>> hostages ) {
		this.hostages = hostages;
	}
}

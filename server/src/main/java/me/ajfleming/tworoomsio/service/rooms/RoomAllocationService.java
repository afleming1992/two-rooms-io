package me.ajfleming.tworoomsio.service.rooms;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.ajfleming.tworoomsio.engine.UserManager;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class RoomAllocationService {

	public static Map<RoomName, Room> generateAndAllocateToRooms( Game game ) {
		Map<RoomName, Room> rooms = new HashMap<>();

		Room alpha = buildRoom( game.getId(), RoomName.ALPHA );
		Room omega = buildRoom( game.getId(), RoomName.OMEGA );

		List<User> players = new ArrayList<>( game.getPlayers() );
		Collections.shuffle( players );

		int maximumPlayers = calculateMaximumPlayersInRoom( players.size() );

		alpha.addPlayers( players.subList( 0, maximumPlayers ), "Initial Room" );
		omega.addPlayers( players.subList( maximumPlayers, players.size() ), "Initial Room" );

		rooms.put( RoomName.ALPHA, alpha );
		rooms.put( RoomName.OMEGA, omega );

		return rooms;
	}

	private static int calculateMaximumPlayersInRoom( int playerNumber ) {
		int remainder = playerNumber % 2;
		return ( playerNumber / 2 ) + remainder;
	}

	private static Room buildRoom( String gameId, RoomName name ) {
		Room room = new Room();
		room.setRoomName( name );
		room.setChannelName( gameId );
		return room;
	}
}

package me.ajfleming.tworoomsio.service.rooms;

import java.util.List;

import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class HostageSwitchService {
	public static Game performHostageSwitch( Game game ) {
		Room alpha = game.getRoom( RoomName.ALPHA );
		Room omega = game.getRoom( RoomName.OMEGA );

		List<User> alphaHostages = alpha.removeHostages();
		List<User> omegaHostages = omega.removeHostages();

		alpha.addPlayers( omegaHostages );
		omega.addPlayers( alphaHostages );

		game.updateRoom( alpha );
		game.updateRoom( omega );

		return game;
	}
}

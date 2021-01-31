package me.ajfleming.tworoomsio.service.rooms;

import java.util.List;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class HostageSwitchService {

  public static Game performHostageSwitch(Game game) {
    Room east = game.getRoom(RoomName.EAST_WING);
    Room west = game.getRoom(RoomName.WEST_WING);

    List<User> eastHostages = east.removeHostages();
    List<User> westHostages = west.removeHostages();

    east.addPlayers(westHostages, "Hostage switch from West");
    west.addPlayers(eastHostages, "Hostage switch from East");

    return game;
  }
}
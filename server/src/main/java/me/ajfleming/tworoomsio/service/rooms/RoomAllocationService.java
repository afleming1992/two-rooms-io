package me.ajfleming.tworoomsio.service.rooms;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class RoomAllocationService {

  public static Map<RoomName, Room> generateAndAllocateToRooms(Game game) {
    Map<RoomName, Room> rooms = new HashMap<>();

    Room east = buildRoom(game.getId(), RoomName.EAST_WING);
    Room west = buildRoom(game.getId(), RoomName.WEST_WING);

    List<User> players = new ArrayList<>(game.getPlayers());
    Collections.shuffle(players);

    int maximumPlayers = calculateMaximumPlayersInRoom(players.size());

    east.addPlayers(players.subList(0, maximumPlayers), "Initial Room");
    west.addPlayers(players.subList(maximumPlayers, players.size()), "Initial Room");

    rooms.put(RoomName.EAST_WING, east);
    rooms.put(RoomName.WEST_WING, west);

    return rooms;
  }

  private static int calculateMaximumPlayersInRoom(int playerNumber) {
    int remainder = playerNumber % 2;
    return (playerNumber / 2) + remainder;
  }

  private static Room buildRoom(String gameId, RoomName name) {
    Room room = new Room();
    room.setRoomName(name);
    room.setChannelName(gameId);
    return room;
  }
}
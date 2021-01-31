package me.ajfleming.tworoomsio.model;

import java.util.List;

public class RoundMap {

  public static List<Round> getRoundData(int numberOfPlayers) {
    if (numberOfPlayers >= 22) {
      return List.of(new Round(1, 3), new Round(2, 2), new Round(1, 1));
    } else if (numberOfPlayers >= 14) {
      return List.of(new Round(1, 2), new Round(2, 1), new Round(3, 1));
    } else {
      return List.of(new Round(1, 1), new Round(2, 1), new Round(3, 1));
    }
  }
}

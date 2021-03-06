package me.ajfleming.tworoomsio.storage;

import java.util.Optional;
import me.ajfleming.tworoomsio.model.Game;

public interface GameCache {

  /**
   * Returns the Game object mapped to the GameId
   * @param gameId The Unique Identifier of the Game
   * @return The Game Object representing the game
   */
  Optional<Game> getGame(String gameId);

  /**
   * Updates the GameCache with an update to date version of the game
   * @param game The updated game object
   */
  void addGame(Game game);
}

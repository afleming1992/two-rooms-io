package me.ajfleming.tworoomsio.storage;

import java.util.List;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Game;

public interface GameCache {

  /**
   * Returns the Game object mapped to the GameId
   * @param gameId The Unique Identifier of the Game
   * @return The Game Object representing the game
   */
  Game getGame(String gameId) throws GameException;

  /**
   * Updates the GameCache with an update to date version of the game
   * @param game The updated game object
   */
  void addGame(Game game);

  /**
   * Returns a list of all the games a player is part of
   * @param playerToken The unique identifier of a player
   * @return A List of games the player is currently in
   */
  List<Game> getGamesPlayerIsIn(String playerToken);

  /**
   * Removes a game from the Cache
   * @param gameId The unique identifier of the game being deleted
   */
  void deleteGame(String gameId);
}

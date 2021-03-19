package me.ajfleming.tworoomsio.storage;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.Getter;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Game Cache implementation where the Game's are stored within Memory whilst the server is running
 */
@Repository
public class GameCacheInMemoryImpl implements GameCache {

  @Getter
  private final Map<String, Game> games;

  @Autowired
  public GameCacheInMemoryImpl() {
    games = new HashMap<>();
  }

  public GameCacheInMemoryImpl(Map<String, Game> games) {
    this.games = games;
  }

  @Override
  public Game getGame(String gameId) throws GameException {
    if(games.containsKey(gameId)) {
      return games.get(gameId);
    } else {
      throw new GameException("Game Not Found!");
    }
  }

  @Override
  public void addGame(Game game) {
    games.put(game.getId(), game);
  }
}

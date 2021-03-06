package me.ajfleming.tworoomsio.storage;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.Getter;
import me.ajfleming.tworoomsio.model.Game;

/**
 * Game Cache implementation where the Game's are stored within Memory whilst the server is running
 */
public class GameCacheInMemoryImpl implements GameCache {

  @Getter
  private final Map<String, Game> games;

  public GameCacheInMemoryImpl() {
    games = new HashMap<>();
  }

  public GameCacheInMemoryImpl(Map<String, Game> games) {
    this.games = games;
  }

  @Override
  public Optional<Game> getGame(String gameId) {
    return Optional.ofNullable(games.get(gameId));
  }

  @Override
  public void addGame(Game game) {
    games.put(game.getId(), game);
  }
}

package me.ajfleming.tworoomsio.storage;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.Optional;
import me.ajfleming.tworoomsio.model.Game;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameCacheInMemoryImplTest {

  @Nested
  class GetGame {

    @Test
    @DisplayName("Should return game if the game is in the cache")
    void shouldReturnGameIfTheGameIsInTheCache() {
      // Setup
      String id = "AnRandomId";
      Game storedGame = new Game();
      storedGame.setId(id);
      GameCacheInMemoryImpl gameCacheInMemory = new GameCacheInMemoryImpl(Map.of(id, storedGame));

      // Test
      Optional<Game> result = gameCacheInMemory.getGame(id);

      // Assert
      assertTrue(result.isPresent());
      assertThat(result.get().getId(), is(id));
    }

    @Test
    @DisplayName("Should return empty optional when game is not in the cache")
    void shouldReturnEmptyOptionalWhenGameIsNotInTheCache() {
      // Setup
      GameCacheInMemoryImpl gameCacheInMemory = new GameCacheInMemoryImpl();

      // Test
      Optional<Game> result = gameCacheInMemory.getGame("RandomString");

      // Assert
      assertTrue(result.isEmpty());
    }
  }

  @Nested
  class UpdateGame {

    @Test
    @DisplayName("Should store game in map when Id matches game")
    void shouldStoreGameInMapWhenIdMatchesGame() {
      // Setup
      String gameId = "ARandomId";
      GameCacheInMemoryImpl gameCache = new GameCacheInMemoryImpl();
      Game game = new Game();
      game.setId(gameId);

      // Test
      gameCache.addGame(game);

      // Assert
      Map<String, Game> gameMap = gameCache.getGames();
      assertTrue(gameMap.containsKey(gameId));
      assertThat(gameMap.get(gameId), is(game));
    }
  }
}
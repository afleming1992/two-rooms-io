package me.ajfleming.tworoomsio.storage;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import com.corundumstudio.socketio.SocketIOClient;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameCacheInMemoryImplTest {

  private GameCacheInMemoryImpl gameCache;

  @BeforeEach
  void setup() {
    gameCache = new GameCacheInMemoryImpl();
  }

  @Nested
  class GetGame {

    @Test
    @DisplayName("Should return game if the game is in the cache")
    void shouldReturnGameIfTheGameIsInTheCache() throws GameException {
      // Setup
      String id = "AnRandomId";
      Game storedGame = new Game();
      storedGame.setId(id);
      GameCacheInMemoryImpl gameCacheInMemory = new GameCacheInMemoryImpl(Map.of(id, storedGame));

      // Test
      Game result = gameCacheInMemory.getGame(id);

      // Assert
      assertThat(result.getId(), is(id));
    }

    @Test
    @DisplayName("Should throw GameException when game is not in the cache")
    void shouldReturnEmptyOptionalWhenGameIsNotInTheCache() {
      assertThrows(GameException.class, () -> {
        gameCache.getGame("RandomString");
      });
    }
  }

  @Nested
  class AddGame {

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

  @Nested
  class DeleteGame {

    @Test
    @DisplayName("Should remove game from cache when id matches a game")
    void shouldRemoveGameFromCacheWhenIdMatchesAGame() {
      // Setup
      String gameId = "ARandomId";
      Game game = new Game();
      game.setId(gameId);
      gameCache.addGame(game);
      assertThat(gameCache.getGames().size(), equalTo(1));

      // Test
      gameCache.deleteGame(gameId);

      // Assert
      assertThat(gameCache.getGames().size(), equalTo(0));
    }

    @Test
    @DisplayName("Should not remove game from cache when ID does not match a game")
    void shouldNotRemoveGameFromCacheWhenIdDoesNotMatchAGame() {
      // Setup
      String gameId = "ARandomId";
      Game game = new Game();
      game.setId(gameId);
      gameCache.addGame(game);
      assertThat(gameCache.getGames().size(), equalTo(1));

      // Test
      gameCache.deleteGame("ATotallyDifferentId");

      // Assert
      assertThat(gameCache.getGames().size(), equalTo(1));
    }

  }

  @Nested
  class GetGamesPlayerIsIn {

    @Mock
    private SocketIOClient client;

    @Test
    @DisplayName("Should return games a player is in")
    void shouldReturnGamesAPlayerIsIn() {
      // Setup
      String userToken = "ARandomUserToken";
      User user = createUser(userToken, client);

      Game game = createGame("ARandomId");
      game.addPlayer(user);

      gameCache.addGame(game);

      // Test
      List<Game> gameList = gameCache.getGamesPlayerIsIn(userToken);

      // Assert
      assertThat(gameList, contains(game));
    }
  }

  private Game createGame(String gameId) {
    Game game = new Game();
    game.setId(gameId);
    return game;
  }

  private User createUser(String userToken, SocketIOClient socketIOClient) {
    User user = new User("Andrew", socketIOClient);
    user.setUserToken(userToken);
    return user;
  }
}
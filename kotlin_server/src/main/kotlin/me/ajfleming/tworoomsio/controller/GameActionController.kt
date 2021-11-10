package me.ajfleming.tworoomsio.controller

import com.corundumstudio.socketio.SocketIOClient
import me.ajfleming.tworoomsio.engine.GameEngine
import me.ajfleming.tworoomsio.engine.PlayerManager
import me.ajfleming.tworoomsio.exception.GameException
import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player
import me.ajfleming.tworoomsio.storage.GameCache
import org.springframework.stereotype.Component

@Component
abstract class GameActionController(
    val gameEngine: GameEngine,
    val gameCache: GameCache,
    val playerManager: PlayerManager
) {

    // Helper Functions

    protected fun getGameAndPlayer(client: SocketIOClient, gameId: String): Pair<Game, Player> {
        val player = playerManager.findByClient(client);
        val game = gameCache.getGame(gameId)

        return if (player != null && game != null) Pair(
            game,
            player
        ) else throw GameException("Game or Requestor could not be found")
    }
}
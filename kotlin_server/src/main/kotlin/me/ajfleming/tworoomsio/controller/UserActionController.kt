package me.ajfleming.tworoomsio.controller

import com.corundumstudio.socketio.SocketIOClient
import me.ajfleming.tworoomsio.engine.GameEngine
import me.ajfleming.tworoomsio.engine.PlayerManager
import me.ajfleming.tworoomsio.exception.GameException
import me.ajfleming.tworoomsio.socket.event.game.ReloadGameEvent
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse
import me.ajfleming.tworoomsio.socket.response.Response
import me.ajfleming.tworoomsio.storage.GameCache
import org.springframework.stereotype.Component

@Component
class UserActionController(
    val gameEngine: GameEngine,
    val gameCache: GameCache,
    val playerManager: PlayerManager
) {

    fun createGame(client: SocketIOClient, name: String) {
        val player = playerManager.create(client, name)
        try {
            val game = gameEngine.createNewGame(player)
            gameCache.addGame(game)
            gameEngine.joinGame(game, player)
            player.sendEvent(
                "JOIN_GAME_SUCCESS",
                JoinGameResponse(game.id, player.id, player.secret)
            )
        } catch (e: GameException) {
            player.sendEvent("CREATE_GAME_ERROR", Response.error(e.message))
        }
    }

    fun joinGame(client: SocketIOClient, name: String, joinGameCode: String) {
        val player = playerManager.create(client, name);
        try {
            val game =
                gameCache.getGameByJoinCode(joinGameCode) ?: throw GameException("Game Not Found")
            gameEngine.joinGame(game, player)
            player.sendEvent(
                "JOIN_GAME_SUCCESS",
                JoinGameResponse(game.id, player.id, player.secret)
            )
        } catch (e: GameException) {
            player.sendEvent("JOIN_GAME_ERROR", Response.error(e.message))
        }
    }

    fun reloadGameSession(client: SocketIOClient, event: ReloadGameEvent) {
        val player = playerManager.reconnect(client, event.playerToken, event.playerSecret)

        if (player != null) {
            gameCache.getGame(event.gameId)?.let {
                gameEngine.reloadPlayerIntoGame(it, player)
                player.sendEvent(
                    "RELOAD_GAME_SESSION_SUCCESS",
                    JoinGameResponse(event.gameId, event.playerToken, event.playerSecret)
                )
            }
        } else {
            client.sendEvent(
                "RELOAD_GAME_SESSION_ERROR",
                Response.error("Failed to reconnect player")
            )
        }
    }

    fun disconnectPlayer(client: SocketIOClient) {
        playerManager.handleDisconnect(client)?.let {
            gameEngine.disconnectPlayer(it)
        }
    }

    fun startNextRound(client: SocketIOClient, gameId: String) {
        playerManager.findByClient(client)?.let { player ->
            gameCache.getGame(gameId)?.let { game ->
                try {
                    gameEngine.nextRound(game, player)
                } catch(e:GameException) {
                    player.sendEvent("START_NEXT_ROUND_ERROR", Response.error(e.message))
                }
            }
        }
    }


}
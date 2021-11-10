package me.ajfleming.tworoomsio.controller

import com.corundumstudio.socketio.SocketIOClient
import me.ajfleming.tworoomsio.engine.GameEngine
import me.ajfleming.tworoomsio.engine.PlayerManager
import me.ajfleming.tworoomsio.exception.GameException
import me.ajfleming.tworoomsio.model.CardKey
import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player
import me.ajfleming.tworoomsio.socket.event.game.GameIdentityPayload
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse
import me.ajfleming.tworoomsio.socket.response.Response
import me.ajfleming.tworoomsio.storage.GameCache
import org.springframework.stereotype.Component

@Component
class HostActionController (
    gameEngine: GameEngine,
    gameCache: GameCache,
    playerManager: PlayerManager
) : GameActionController(gameEngine, gameCache, playerManager) {

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

    fun startNextRound(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, host) ->
            gameEngine.nextRound(game, host)
        }
    }

    fun startGameTimer(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, host) ->
            try {
                gameEngine.startTimer(game, host)
            } catch (e: GameException) {
                playerManager.sendEvent(host, "START_TIMER_ERROR", Response.error(e.message))
            }
        }
    }

    fun pauseGameTimer(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, host) ->
            try {
                gameEngine.pauseTimer(game, host)
            } catch (e: GameException) {
                playerManager.sendEvent(host, "PAUSE_TIMER_ERROR", Response.error(e.message))
            }
        }
    }

    fun restartGameTimer(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, host) ->
            try {
                gameEngine.restartTimer(game, host)
            } catch (e: GameException) {
                playerManager.sendEvent(host, "RESTART_TIMER_ERROR", Response.error(e.message))
            }
        }
    }

    fun revealPlayerAssignment(client: SocketIOClient, gameId: String, cardKey: CardKey) {
        getGameAndPlayer(client, gameId).let { (game, host) ->
            try {
                gameEngine.revealCardAssignment(game, host, cardKey)
            } catch (e: GameException) {
                playerManager.sendEvent(host, "REVEAL_CARD_ASSIGNMENT_ERROR", Response.error(e.message))
            }
        }
    }
}
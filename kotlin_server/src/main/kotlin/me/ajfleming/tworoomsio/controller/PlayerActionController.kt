package me.ajfleming.tworoomsio.controller

import com.corundumstudio.socketio.SocketIOClient
import me.ajfleming.tworoomsio.engine.GameEngine
import me.ajfleming.tworoomsio.engine.PlayerManager
import me.ajfleming.tworoomsio.exception.GameException
import me.ajfleming.tworoomsio.model.CardKey
import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player
import me.ajfleming.tworoomsio.socket.event.game.ReloadGameEvent
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse
import me.ajfleming.tworoomsio.socket.response.RequestShareResponse
import me.ajfleming.tworoomsio.socket.response.Response
import me.ajfleming.tworoomsio.storage.GameCache
import org.springframework.stereotype.Component

@Component
class PlayerActionController(
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
        getGameAndPlayer(client, gameId).let { (game, player) ->
            try {
                gameEngine.nextRound(game, player)
            } catch (e: GameException) {
                player.sendEvent("START_NEXT_ROUND_ERROR", Response.error(e.message))
            }
        }
    }

    fun startGameTimer(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, player) ->
            try {
                gameEngine.startTimer(game, player)
            } catch (e: GameException) {
                player.sendEvent("START_NEXT_ROUND_ERROR", Response.error(e.message))
            }
        }
    }

    fun pauseGameTimer(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, player) ->
            try {
                gameEngine.pauseTimer(game, player)
            } catch (e: GameException) {
                player.sendEvent("PAUSE_TIMER_ERROR", Response.error(e.message))
            }
        }
    }

    fun restartGameTimer(client: SocketIOClient, gameId: String) {
        getGameAndPlayer(client, gameId).let { (game, player) ->
            try {
                gameEngine.restartTimer(game, player)
            } catch (e: GameException) {
                player.sendEvent("RESTART_TIMER_ERROR", Response.error(e.message))
            }
        }
    }

    fun revealCardAssignment(client: SocketIOClient, gameId: String, card: CardKey) {
        getGameAndPlayer(client, gameId).let { (game, player) ->
            try {
                gameEngine.revealCardAssignment(game, player, card)
            } catch (e: GameException) {
                player.sendEvent("REVEAL_CARD_ASSIGNMENT_ERROR", Response.error(e.message))
            }
        }
    }

    fun requestShare(client: SocketIOClient, request: CardShareRequest) {
        getGameAndPlayer(client, request.gameId).let { (game, requestor) ->
            request.requestor = requestor.id
            try {
                gameEngine.requestShare(game, requestor, request)
                client.sendEvent("REQUEST_SHARE_SUCCESS, Response.")
            } catch (e: GameException) {
                client.sendEvent("REQUEST_SHARE_ERROR", Response.error(e.message))
            }
        }
    }

    fun acceptShare(client: SocketIOClient, gameId: String, requestId: String) {
        getGameAndPlayer(client, gameId).let { (game, recipient) ->
            try {
                gameEngine.acceptShare(game, recipient, requestId)
            } catch (e: GameException) {
                playerManager.sendEvent(recipient, "ANSWER_SHARE_ERROR", Response.error(e.message))
            }
        }
    }

    fun rejectShare(client: SocketIOClient, gameId: String, requestId: String) {
        getGameAndPlayer(client, gameId).let { (game, recipient) ->
            try {
                gameEngine.rejectShare(game, recipient, requestId)
                playerManager.sendEvent(
                    recipient,
                    "REJECT_SHARE_SUCCESS",
                    RequestShareResponse(requestId)
                )
            } catch (e: GameException) {
                playerManager.sendEvent(recipient, "ANSWER_SHARE_ERROR", Response.error(e.message))
            }
        }
    }

    fun privateReveal(client: SocketIOClient, request: CardShareRequest) {
        getGameAndPlayer(client, request.gameId).let { (game, requestor) ->
            try {
                gameEngine.privateReveal(game, requestor, request)
            } catch (e: GameException) {
                playerManager.sendEvent(requestor, "REQUEST_SHARE_ERROR", Response.error(e.message))
            }
        }
    }

    // Helper Functions

    private fun getGameAndPlayer(client: SocketIOClient, gameId: String): Pair<Game, Player> {
        val player = playerManager.findByClient(client);
        val game = gameCache.getGame(gameId)

        return if (player != null && game != null) Pair(
            game,
            player
        ) else throw GameException("Game or Requestor could not be found")
    }
}
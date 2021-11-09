package me.ajfleming.tworoomsio.engine

import com.corundumstudio.socketio.SocketIOServer
import me.ajfleming.tworoomsio.exception.GameException
import me.ajfleming.tworoomsio.model.CardKey
import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player
import me.ajfleming.tworoomsio.model.Round
import me.ajfleming.tworoomsio.service.DeckBuilderService
import me.ajfleming.tworoomsio.service.DeckDealerService
import me.ajfleming.tworoomsio.service.JoinCodeGenerator
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareType
import me.ajfleming.tworoomsio.socket.response.CardRevealResponse
import me.ajfleming.tworoomsio.storage.GameCache
import me.ajfleming.tworoomsio.timer.RoundTimer.Companion.setupTimer
import org.springframework.stereotype.Component
import java.util.*

object GameDefaults {
    const val TOTAL_ROUND_SECONDS: Long = 180
}

@Component
class GameEngine (
    val socketServer: SocketIOServer,
    val deckBuilderService: DeckBuilderService,
    val userManager: PlayerManager,
    val gameCache: GameCache
) {
    fun createNewGame(host: Player): Game {
        return Game(host = host, joinCode = JoinCodeGenerator.generateJoinCode())
    }

    fun joinGame(game: Game, player: Player) {
        if( game.round > 0 ) throw GameException("Game has already started");
        if( game.findPlayer(player.name) != null ) throw GameException("Someone has aleady used that name! Maybe you have a popular name like Andrew? 🤔")

        game.addPlayer(player)
        addPlayerToGameComms(player, game)
        game.deck = deckBuilderService.buildDeck(game.getPlayerCount())
    }

    fun reloadPlayerIntoGame(game: Game, player: Player) {
        if(!game.reconnectPlayer(player)) throw GameException("Failed to reconnect to game");
        addPlayerToGameComms(player, game)
        reloadPlayerGameData(game, player)
        pingGameUpdateEvent(game)
    }

    fun disconnectPlayer(player: Player) {
        val games = gameCache.getGamesPlayerIsIn(player);
        for( game in games ) {
            game.disconnectPlayer(player)
            when {
                game.getPlayerCount() > 0 -> pingGameUpdateEvent(game)
                else -> gameCache.deleteGame(game.id)
            }
        }
    }

    fun startGame(game: Game, host: Player) {
        if(!game.isAllSeatsFilled()) throw GameException("Game doesn't have enough players to start!")
        if(!game.isPlayerHost(host)) throw GameException("You are not the host of this game!")
        game.nextRound()
        game.roundData = Round.getRoundData(game.getPlayerCount())
        game.cardAssignments = DeckDealerService.dealDeck(game.deck, game.players)
        game.timer = setupTimer(GameDefaults.TOTAL_ROUND_SECONDS, game, socketServer)
        pingGameUpdateEvent(game)
    }

    fun nextRound(game: Game, host: Player) {
        if(!game.isPlayerHost(host)) throw GameException("You are not the host of this game!")
        if(game.round == 0) {
            startGame(game, host)
        } else {
            game.nextRound()
            game.timer = setupTimer(GameDefaults.TOTAL_ROUND_SECONDS, game, socketServer)
        }
        clearEventsAndRequests(game)
        pingGameUpdateEvent(game)
    }

    fun startTimer(game: Game, host: Player) {
        verifyHost(game, host)
        game.timer?.start()
    }

    fun pauseTimer(game: Game, host: Player) {
        verifyHost(game, host)
        game.timer?.stop()
    }

    fun restartTimer(game: Game, host: Player) {
        verifyHost(game, host)
        when(game.timer?.timerRunning) {
            true -> game.timer?.stop()
        }
        game.timer = setupTimer(GameDefaults.TOTAL_ROUND_SECONDS, game, socketServer);
        pingGameUpdateEvent(game)
    }

    fun revealCardAssignment(game: Game, host: Player, card: CardKey) {
        verifyHost(game, host)
        val players = game.getPlayerAssignmentForCard(card)
        for(player in players) {
            game.permanentRevealPlayerCard(player)
        }
        pingGameUpdateEvent(game)
    }

    // Card Sharing Operations

    fun requestShare(game: Game, requestor: Player, request: CardShareRequest) {
        if(game.timer == null || game.timer?.timerRunning != true ) throw GameException("Card Shares are blocked when game is paused")
        game.findPlayer(request.recipient)?.let {
            request.id = UUID.randomUUID().toString()
            game.addShareRequest(request)
            userManager.sendEvent(it, "SHARE_REQUEST_RECEIVED", request);
        }
    }

    fun privateReveal(game: Game, requestor: Player, request: CardShareRequest) {
        if(!game.timer?.timerRunning!!) throw GameException("Card Shares are blocked when game is paused")
        game.findPlayer(request.recipient)?.let {
            sendCardDataToPlayer(game, request, it, requestor)
        }
    }
    
    fun acceptShare(game: Game, recipient: Player, requestId: String) {
        val request: CardShareRequest = confirmIfShareAnswerIsAllowed(game, recipient, requestId)
        val requestor = game.findPlayer(request.requestor) ?: throw GameException("Requestor not found")
        sendCardDataToPlayer(game, request, requestor, recipient)
        sendCardDataToPlayer(game, request, recipient, requestor)
    }

    fun rejectShare(game: Game, recipient: Player, requestId: String) {
        val request = confirmIfShareAnswerIsAllowed(game, recipient, requestId)
        game.findPlayer(request.requestor)?.let {
            userManager.sendEvent(it, "SHARE_REQUEST_REJECTED", request)
        }

        game.invalidateCardShareRequest(request.id)
    }

    private fun confirmIfShareAnswerIsAllowed(game: Game, recipient: Player, requestId: String): CardShareRequest {
        if(!game.timer?.timerRunning!!) throw GameException("Answering a Request is blocked when game is paused")
        val cardShareRequest = game.getCardShareRequest(requestId) ?: throw GameException("Card Share Request not found")
        if (recipient.isThisUser(cardShareRequest.recipient)) {
           return cardShareRequest;
        } else throw GameException("Card share request is no longer valid")
    }

    private fun sendCardDataToPlayer(
        game: Game,
        request: CardShareRequest,
        recipient: Player,
        cardOwner: Player
    ) {
        var eventName : String
        game.getRoleAssignment(cardOwner)?.let {
            if(request.id.isEmpty()) {
                eventName = "CARD_SHARE_ACCEPTED"
            } else {
                request.id = UUID.randomUUID().toString()
                eventName = "PRIVATE_REVEAL_RECEIVED"
            }

            val event: CardRevealResponse = when(request.type) {
                CardShareType.ROLE -> CardRevealResponse.roleShare(
                    requestId = request.id,
                    player = cardOwner,
                    role = it
                )
                CardShareType.COLOUR -> CardRevealResponse.colourShare(
                    requestId = request.id,
                    player = cardOwner,
                    role = it
                )
            }

            try {
                userManager.sendEvent(recipient, eventName, event);
            } catch (e: Exception) {
                throw GameException(e.message ?: "")
            }
        } ?: run {
            throw GameException("Failed to find role assignment for user")
        }
    }

    // Helper Methods

    private fun verifyHost(game: Game, host: Player) {
        if(!game.isPlayerHost(host)) throw GameException("You are not the host of this game!")
    }

    private fun clearEventsAndRequests(game: Game) {
        sendEventToGame(game, "CLEAR_EVENTS")
        game.resetCardShares();
    }

    private fun addPlayerToGameComms(player: Player, game: Game) {
        player.client.joinRoom(game.channelName);
    }

    private fun reloadPlayerGameData(game: Game, player: Player) {
        if(game.hasStarted()) {
            game.getRoleAssignment(player)?.let { player.sendEvent("CARD_UPDATE", it) }
        }
    }

    private fun pingGameUpdateEvent(game: Game) {
        sendEventToGame(game, "GAME_UPDATE", game)
    }

    private fun sendEventToGame(game: Game, eventName: String, data: Any? = null) {
        socketServer.getRoomOperations(game.channelName).sendEvent(eventName, data)
    }
}
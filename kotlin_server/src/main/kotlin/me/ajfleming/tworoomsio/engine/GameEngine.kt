package me.ajfleming.tworoomsio.engine

import com.corundumstudio.socketio.SocketIOServer
import me.ajfleming.tworoomsio.exception.GameException
import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player
import me.ajfleming.tworoomsio.model.Round
import me.ajfleming.tworoomsio.service.DeckBuilderService
import me.ajfleming.tworoomsio.service.DeckDealerService
import me.ajfleming.tworoomsio.service.JoinCodeGenerator
import me.ajfleming.tworoomsio.storage.GameCache
import me.ajfleming.tworoomsio.timer.RoundTimer.Companion.setupTimer
import org.springframework.stereotype.Component

object GameDefaults {
    const val TOTAL_ROUND_SECONDS: Long = 180
}

@Component
class GameEngine (
    val socketServer: SocketIOServer,
    val deckBuilderService: DeckBuilderService,
    val userManager: UserManager,
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
        game.timer = setupTimer(GameDefaults.TOTAL_ROUND_SECONDS, game, socketServer);
        pingGameUpdateEvent(game);
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

    private fun sendEventToGame(game: Game, eventName: String, data: Any) {
        socketServer.getRoomOperations(game.channelName).sendEvent(eventName, data)
    }
}
package me.ajfleming.tworoomsio.storage

import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player
import org.springframework.stereotype.Repository

@Repository
class GameCacheInMemoryImpl (
    val games: HashMap<String, Game> = HashMap()
) : GameCache {
    override fun getGame(gameId: String): Game? {
        return games[gameId]
    }

    override fun getGameByJoinCode(joinCode: String): Game? {
        return games.values.find{  it.joinCode == joinCode }
    }

    override fun addGame(game: Game) {
        games[game.id] = game
    }

    override fun getGamesPlayerIsIn(player: Player): List<Game> {
        return games.values.filter { game -> game.findPlayer(player.id) != null }
    }

    override fun deleteGame(gameId: String) {
        games.remove(gameId)
    }
}
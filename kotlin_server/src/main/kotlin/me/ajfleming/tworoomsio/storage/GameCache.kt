package me.ajfleming.tworoomsio.storage

import me.ajfleming.tworoomsio.model.Game
import me.ajfleming.tworoomsio.model.Player

interface GameCache {

    fun getGame(gameId: String) : Game?

    fun getGameByJoinCode(joinCode: String) : Game?

    fun addGame(game: Game)

    fun getGamesPlayerIsIn(playerToken: Player) : List<Game>

    fun deleteGame(gameId: String)
}
package me.ajfleming.tworoomsio.storage

import me.ajfleming.tworoomsio.model.Game

interface GameCache {

    fun getGame(gameId: String) : Game?

    fun getGameByJoinCode(joinCode: String) : Game?

    fun addGame(game: Game)

    fun getGamesPlayerIsIn(playerToken: String) : List<Game>

    fun deleteGame(gameId: String)
}
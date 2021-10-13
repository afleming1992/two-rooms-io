package me.ajfleming.tworoomsio.socket.event.game

data class JoinGameEvent(
    val joinGameCode: String,
    val name: String
)
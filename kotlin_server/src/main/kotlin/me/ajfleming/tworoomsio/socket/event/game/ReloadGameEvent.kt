package me.ajfleming.tworoomsio.socket.event.game

data class ReloadGameEvent (
    val gameId: String,
    val playerToken: String,
    val playerSecret: String
)
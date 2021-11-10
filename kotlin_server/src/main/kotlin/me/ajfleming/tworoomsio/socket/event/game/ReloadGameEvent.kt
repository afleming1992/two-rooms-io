package me.ajfleming.tworoomsio.socket.event.game

class ReloadGameEvent (
    val gameId: String,
    val playerToken: String,
    val playerSecret: String
)
package me.ajfleming.tworoomsio.socket.event.game

import me.ajfleming.tworoomsio.model.CardKey

data class RevealPlayerAssignmentEvent(
    var gameId: String,
    val card: CardKey
)
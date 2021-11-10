package me.ajfleming.tworoomsio.socket.event.game

import me.ajfleming.tworoomsio.model.CardKey

class RevealPlayerAssignmentEvent(
    var gameId: String,
    val card: CardKey
)
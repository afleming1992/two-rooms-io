package me.ajfleming.tworoomsio.socket.event.sharing

class ShareDecisionRequest(
    val id: String,
    val gameId: String,
    val type: CardShareType,
    val requestor: String,
    val recipient: String
)
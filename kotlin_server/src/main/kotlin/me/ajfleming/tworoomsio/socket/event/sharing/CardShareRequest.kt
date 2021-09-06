package me.ajfleming.tworoomsio.socket.event.sharing

data class CardShareRequest(
    val id: String,
    val gameId: String,
    val type: CardShareType,
    val requestor: String,
    val recipient: String
)
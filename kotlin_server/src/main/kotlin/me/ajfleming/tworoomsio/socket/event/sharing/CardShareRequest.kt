package me.ajfleming.tworoomsio.socket.event.sharing

data class CardShareRequest(
    var id: String,
    val gameId: String,
    val type: CardShareType,
    val requestor: String,
    val recipient: String
)
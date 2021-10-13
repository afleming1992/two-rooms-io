package me.ajfleming.tworoomsio.socket.response

// Keep as userToken to not break contract with frontend
data class JoinGameResponse(
    val gameToken: String,
    val userToken: String,
    val userSecret: String
)
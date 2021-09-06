package me.ajfleming.tworoomsio.model

import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import java.util.*
import kotlin.collections.ArrayList

data class Game(
    val id: String = UUID.randomUUID().toString(),
    var joinCode: String,
    var host: User,
    var round: Int = 0,
    var numberOfRounds: Int = 3,
    var players: List<User> = ArrayList(),
    var deck: List<Card> = ArrayList(),
    var cardShareRequests: Map<String, CardShareRequest> = HashMap(),
    var revealedCardAssignments: List<CardAssignment> = ArrayList(),

) {

    fun findPlayer(userToken: String) : User? {
        return players.find { it.userToken == userToken }
    }
}
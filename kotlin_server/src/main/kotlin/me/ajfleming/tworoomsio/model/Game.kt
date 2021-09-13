package me.ajfleming.tworoomsio.model

import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import me.ajfleming.tworoomsio.timer.RoundTimer
import java.util.*
import kotlin.collections.ArrayList

data class Game(
    val id: String = UUID.randomUUID().toString(),
    val channelName: String = "game/${id}",
    var joinCode: String,
    var host: Player,
    var round: Int = 0,
    var numberOfRounds: Int = 3,
    var roundData: List<Round> = ArrayList(),
    var players: MutableList<Player> = ArrayList(),
    var deck: List<Card> = ArrayList(),
    var cardShareRequests: Map<String, CardShareRequest> = HashMap(),
    var cardAssignments: Map<String, Card> = HashMap(),
    var revealedCardAssignments: List<CardAssignment> = ArrayList(),
    var timer: RoundTimer? = null
) {

    fun findPlayer(userToken: String) : Player? {
        return players.find { it.userToken == userToken }
    }

    fun findPlayerByName(name: String) : Player? {
        return players.find { it.name == name }
    }

    fun addPlayer(player: Player) {
        players.add(player)
    }

    fun reconnectPlayer(player: Player) : Boolean {
        val foundPlayer = players.find { user -> user.isThisUser(player) }
        foundPlayer?.reconnectUser(player.client)
        return foundPlayer != null
    }

    fun disconnectPlayer(player: Player) {
        val foundPlayer = players.find { it.isThisUser(player) }
        foundPlayer?.let {
            if(hasStarted() || isPlayerHost(foundPlayer)) {
                // Soft Disconnect the Player
                foundPlayer.disconnectPlayer()
            } else {
                // Remove Player from game completely
                players.remove(foundPlayer)
            }
        }
    }

    fun getRoleAssignment(player: Player) : Card? {
        return cardAssignments[player.userToken]
    }

    fun getPlayerCount(): Int = players.size
    fun hasStarted(): Boolean = round > 0
    fun isAllSeatsFilled(): Boolean = deck.size == players.size
    fun isPlayerHost(player: Player): Boolean = host.isThisUser(player)
    fun nextRound() = round++
}
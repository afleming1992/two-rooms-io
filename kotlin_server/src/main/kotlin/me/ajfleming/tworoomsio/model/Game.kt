package me.ajfleming.tworoomsio.model

import com.fasterxml.jackson.annotation.JsonIgnore
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import me.ajfleming.tworoomsio.timer.RoundTimer
import java.util.*

class Game(
    val id: String = UUID.randomUUID().toString(),
    val channelName: String = "game/${id}",
    var joinCode: String,
    var host: Player,
    var round: Int = 0,
    var numberOfRounds: Int = 3,
    var roundData: List<Round> = ArrayList(),
    var players: MutableList<Player> = ArrayList(),
    var deck: List<Card> = ArrayList(),
    @JsonIgnore
    var cardShareRequests: MutableMap<String, CardShareRequest> = HashMap(),
    @JsonIgnore
    var cardAssignments: Map<String, Card> = HashMap(),
    var revealedCardAssignments: MutableList<CardAssignment> = ArrayList(),
    var timer: RoundTimer? = null
) {

    fun findPlayer(userToken: String): Player? {
        return players.find { it.id == userToken }
    }

    fun findPlayerByName(name: String): Player? {
        return players.find { it.name == name }
    }

    fun getCardShareRequest(requestId: String): CardShareRequest? {
        return cardShareRequests[requestId]
    }

    fun addPlayer(player: Player) {
        players.add(player)
    }

    fun reconnectPlayer(player: Player): Boolean {
        val foundPlayer = players.find { user -> user.isThisUser(player) }
        foundPlayer?.reconnectUser(player.client)
        return foundPlayer != null
    }

    fun disconnectPlayer(player: Player) {
        val foundPlayer = players.find { it.isThisUser(player) }
        foundPlayer?.let {
            if (hasStarted() || isPlayerHost(foundPlayer)) {
                // Soft Disconnect the Player
                foundPlayer.disconnectPlayer()
            } else {
                // Remove Player from game completely
                players.remove(foundPlayer)
            }
        }
    }

    fun getRoleAssignment(player: Player): Card? {
        return cardAssignments[player.id]
    }

    fun resetCardShares() {
        cardShareRequests = HashMap<String, CardShareRequest>()
    }

    fun getPlayerAssignmentForCard(card: CardKey): List<Player> {
        val playerTokens = cardAssignments.filter { it.value.cardKey == card }.keys
        return players.filter { playerTokens.contains(it.id) }
    }

    fun permanentRevealPlayerCard(player: Player) {
        val card = cardAssignments[player.id]
        card?.let {
            revealedCardAssignments.add(CardAssignment(player = player.id, card = it))
        }
    }

    fun addShareRequest(request: CardShareRequest) {
        cardShareRequests[request.id] = request
    }

    fun invalidateCardShareRequest(id: String) {
        cardShareRequests.remove(id)
    }

    fun getPlayerCount(): Int = players.size
    fun hasStarted(): Boolean = round > 0
    fun isAllSeatsFilled(): Boolean = deck.size == players.size
    fun isPlayerHost(player: Player): Boolean = host.isThisUser(player)
    fun nextRound() = round++

}
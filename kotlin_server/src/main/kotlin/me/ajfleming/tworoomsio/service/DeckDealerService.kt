package me.ajfleming.tworoomsio.service

import me.ajfleming.tworoomsio.model.Card
import me.ajfleming.tworoomsio.model.Player
import kotlin.collections.HashMap

class DeckDealerService {
    companion object {
        fun dealDeck(cards: List<Card>, players: List<Player>) : Map<String, Card> {
            val result: MutableMap<String, Card> = HashMap()

            val shuffledCards: MutableList<Card> = cards.shuffled().toMutableList()
            val shufflePlayers: MutableList<Player> = players.shuffled().toMutableList()

            shufflePlayers.forEach { player ->
                val card = shuffledCards.removeAt(0)
                player.client.sendEvent("CARD_UPDATE", card)
                result[player.id] = card
            }

            return result
        }
    }
}
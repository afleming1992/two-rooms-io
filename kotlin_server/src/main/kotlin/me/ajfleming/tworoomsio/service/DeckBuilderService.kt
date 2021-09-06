package me.ajfleming.tworoomsio.service

import me.ajfleming.tworoomsio.model.Card
import me.ajfleming.tworoomsio.model.CardSet

class DeckBuilderService (
    val possibleCardSets: Map<CardSet, List<Card>> = cardSetMap
) {

    fun buildDeck(numberOfPlayers: Int) {
        val deck : MutableList<Card> = mutableListOf()
        // Add President and Bomber
        possibleCardSets[CardSet.CORE]?.let { deck.addAll(it) }

        // If Odd number of players, add Gambler
        addGamblerIfOddNumberOfPlayers(deck, numberOfPlayers)

        // Fill in remaining players with normal cards
        fillDeckWithMemberCards(deck, numberOfPlayers)
    }

    fun addGamblerIfOddNumberOfPlayers(deck: MutableList<Card>, numberOfPlayers: Int) {
       if (numberOfPlayers % 2 == 0) {
           possibleCardSets[CardSet.GAMBLER]?.let { deck.addAll(it) }
       }
    }

    fun fillDeckWithMemberCards(deck: MutableList<Card>, numberOfPlayers: Int) {
        var cardsRequired = numberOfPlayers - deck.size

        while(cardsRequired > 1) {
            possibleCardSets[CardSet.FILLER]?.let { deck.addAll(it) }
            cardsRequired =- 2
        }
    }
}
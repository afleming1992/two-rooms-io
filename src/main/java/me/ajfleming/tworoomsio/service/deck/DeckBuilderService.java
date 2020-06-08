package me.ajfleming.tworoomsio.service.deck;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardSet;

public class DeckBuilderService {
	private Map<CardSet, List<Card>> possibleCardSets = CardSetMapProvider.cardMap();

	public List<Card> buildDeckForNumberOfPlayers( int numberOfPlayers ) {
		List<Card> deck = new ArrayList<>();

		// Add President and Bomber
		deck.addAll( possibleCardSets.get(CardSet.CORE) );

		// If Odd number of players, add Gambler
		deck = addGamblerIfOddNumberOfPlayers( deck, numberOfPlayers );

		// Fill in remaining players with normal cards
		deck = fillDeckWithMemberCards( deck, numberOfPlayers );

		return deck;
	}

	private List<Card> addGamblerIfOddNumberOfPlayers( final List<Card> deck, final int numberOfPlayers ) {
		if ( numberOfPlayers % 2 != 0 ) {
			deck.addAll( possibleCardSets.get(CardSet.GAMBLER) );
		}

		return deck;
	}

	private List<Card> fillDeckWithMemberCards( final List<Card> deck, final int numberOfPlayers ) {
		var cardsRequired = numberOfPlayers - deck.size();

		while ( cardsRequired > 1 ) {
			deck.addAll( possibleCardSets.get( CardSet.FILLER ) );
			cardsRequired = cardsRequired - 2;
		}

		return deck;
	}
}

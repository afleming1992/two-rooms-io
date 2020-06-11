package me.ajfleming.tworoomsio.service.deck;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.User;

public class DeckDealerService {

	public static Map<String, Card> dealDeck( List<Card> cards, List<User> users ) {
		Map<String, Card> result = new HashMap<>();

		List<Card> shuffledCards = shuffleCards( cards );
		List<User> shuffledUsers = shuffleUsers( users );

		for( User user: shuffledUsers ) {
			Card card = shuffledCards.remove(0);
			user.getClient().sendEvent( "CARD_UPDATE", card );
			result.put( user.getUserToken().toString(), card );
		}

		return result;
	}

	private static List<Card> shuffleCards( List<Card> cards ) {
		List<Card> result = new ArrayList<>( cards );
		Collections.shuffle( result );

		return result;
	}

	private static List<User> shuffleUsers( List<User> users ) {
		List<User> result = new ArrayList<>( users );
		Collections.shuffle( result );

		return result;
	}
}

package me.ajfleming.tworoomsio.service.deck;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardSet;

public class CardSetMapProvider {
	public static Map<CardSet, List<Card>> cardMap() {
		Map<CardSet, List<Card>> cardMap = new HashMap<>();

		cardMap.put( CardSet.CORE, coreSet() );
		cardMap.put( CardSet.FILLER, filler() );
		cardMap.put( CardSet.GAMBLER, gambler() );

		return cardMap;
	}

	public static List<Card> coreSet() {
		return List.of( Card.PRESIDENT, Card.BOMBER );
	}

	public static List<Card> gambler() {
		return List.of( Card.GAMBLER );
	}

	public static List<Card> filler() {
		return List.of( Card.BLUE_TEAM, Card.RED_TEAM );
	}
}

package me.ajfleming.tworoomsio.service.deck;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardInfo;

class DeckBuilderServiceTest {

	DeckBuilderService service;

	@BeforeEach
	void setup() {
		this.service = new DeckBuilderService();
	}

	@Test
	@DisplayName("buildDeckForNumberOfPlayers: Should return minimal deck when 2 players or less")
	void buildDeck_minimalDeck() {
		// Given / When
		List<Card> deck = service.buildDeck( 2 );

		// Then
		assertThat( deck, containsInAnyOrder( CardInfo.PRESIDENT, CardInfo.BOMBER ) );
	}

	@Test
	@DisplayName("buildDeck: Should have Gambler in deck when odd number of players")
	void buildDeck_oddDeck() {
		// Given / When
		List<Card> deck = service.buildDeck( 3 );

		// Then
		assertThat( deck, containsInAnyOrder( CardInfo.PRESIDENT, CardInfo.BOMBER, CardInfo.GAMBLER ) );
	}

	@Test
	@DisplayName(
			"buildDeck: Should have filler cards when number of players is greater than deck size")
	void buildDeck_fillerCard() {
		// Given / When
		List<Card> deck = service.buildDeck( 4 );

		// Then
		assertThat( deck,
				containsInAnyOrder( CardInfo.PRESIDENT, CardInfo.BOMBER, CardInfo.BLUE_TEAM, CardInfo.RED_TEAM ) );
	}

	@Test
	@DisplayName("buildDeck: Should have correct cards when number of players is 10")
	void buildDeck_basicDeckLargeNumberOfPlayer() {
		// Given / When
		List<Card> deck = service.buildDeck( 10 );

		// Then
		assertThat( deck,
				containsInAnyOrder( CardInfo.PRESIDENT, CardInfo.BOMBER, CardInfo.BLUE_TEAM, CardInfo.RED_TEAM,
						CardInfo.BLUE_TEAM, CardInfo.RED_TEAM, CardInfo.BLUE_TEAM, CardInfo.RED_TEAM,
						CardInfo.BLUE_TEAM, CardInfo.RED_TEAM ) );
	}
}
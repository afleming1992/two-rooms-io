package me.ajfleming.tworoomsio.service.deck;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

import java.util.List;
import java.util.stream.Collectors;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

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
    List<Card> deck = service.buildDeck(2);

    // Then
    assertThat(getCardKeys(deck), containsInAnyOrder(CardKey.PRESIDENT, CardKey.BOMBER));
  }

  @Test
  @DisplayName("buildDeck: Should have Gambler in deck when odd number of players")
  void buildDeck_oddDeck() {
    // Given / When
    List<Card> deck = service.buildDeck(3);

    // Then
    assertThat(getCardKeys(deck),
        containsInAnyOrder(CardKey.PRESIDENT, CardKey.BOMBER, CardKey.GAMBLER));
  }

  @Test
  @DisplayName(
      "buildDeck: Should have filler cards when number of players is greater than deck size")
  void buildDeck_fillerCard() {
    // Given / When
    List<Card> deck = service.buildDeck(4);

    // Then
    assertThat(getCardKeys(deck),
        containsInAnyOrder(CardKey.PRESIDENT, CardKey.BOMBER, CardKey.BLUE_TEAM, CardKey.RED_TEAM));
  }

  @Test
  @DisplayName("buildDeck: Should have correct cards when number of players is 10")
  void buildDeck_basicDeckLargeNumberOfPlayer() {
    // Given / When
    List<Card> deck = service.buildDeck(10);

    // Then
    assertThat(getCardKeys(deck),
        containsInAnyOrder(CardKey.PRESIDENT, CardKey.BOMBER, CardKey.BLUE_TEAM, CardKey.RED_TEAM,
            CardKey.BLUE_TEAM, CardKey.RED_TEAM, CardKey.BLUE_TEAM, CardKey.RED_TEAM,
            CardKey.BLUE_TEAM, CardKey.RED_TEAM));
  }

  private List<CardKey> getCardKeys(List<Card> deck) {
    return deck.stream().map(Card::getKey).collect(Collectors.toList());
  }
}
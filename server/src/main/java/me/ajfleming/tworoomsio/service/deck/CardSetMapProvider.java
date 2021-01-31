package me.ajfleming.tworoomsio.service.deck;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.CardMap;
import me.ajfleming.tworoomsio.model.CardSet;

public class CardSetMapProvider {

  public static Map<CardSet, List<Card>> cardMap() {
    Map<CardSet, List<Card>> cardMap = new HashMap<>();

    cardMap.put(CardSet.CORE, coreSet());
    cardMap.put(CardSet.FILLER, filler());
    cardMap.put(CardSet.GAMBLER, gambler());

    return cardMap;
  }

  public static List<Card> coreSet() {
    return List.of(CardMap.get(CardKey.PRESIDENT), CardMap.get(CardKey.BOMBER));
  }

  public static List<Card> gambler() {
    return List.of(CardMap.get(CardKey.GAMBLER));
  }

  public static List<Card> filler() {
    return List.of(CardMap.get(CardKey.BLUE_TEAM), CardMap.get(CardKey.RED_TEAM));
  }
}

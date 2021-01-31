package me.ajfleming.tworoomsio.model;

import com.google.common.collect.ImmutableMap;
import java.util.Map;

public class CardMap {

  private static final Map<CardKey, Card> cardMap = ImmutableMap.of(
      CardKey.PRESIDENT, new Card(CardKey.PRESIDENT, CardInfo.PRESIDENT),
      CardKey.BOMBER, new Card(CardKey.BOMBER, CardInfo.BOMBER),
      CardKey.GAMBLER, new Card(CardKey.GAMBLER, CardInfo.GAMBLER),
      CardKey.RED_TEAM, new Card(CardKey.RED_TEAM, CardInfo.RED_TEAM),
      CardKey.BLUE_TEAM, new Card(CardKey.BLUE_TEAM, CardInfo.BLUE_TEAM)
  );

  public static Card get(CardKey cardKey) {
    return cardMap.get(cardKey);
  }
}

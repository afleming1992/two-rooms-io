package me.ajfleming.tworoomsio.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Card {

  private CardKey key;
  private String title;
  private String subtitle;
  private String howToWin;
  private String cardImage;
  private Team team;

  public Card(CardKey key, CardInfo cardInfo) {
    this.key = key;
    this.title = cardInfo.getTitle();
    this.subtitle = cardInfo.getSubtitle();
    this.howToWin = cardInfo.getHowToWin();
    this.cardImage = cardInfo.getCardImage();
    this.team = cardInfo.getTeam();
  }
}

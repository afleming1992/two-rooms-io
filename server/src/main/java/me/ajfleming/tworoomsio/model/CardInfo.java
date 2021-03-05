package me.ajfleming.tworoomsio.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum CardInfo {
  PRESIDENT("President",
      "Avoid the Bomber",
      "You are a primary character. The blue team wins if you do not gain the 'dead' condition",
      "president_blue", Team.BLUE),
  BOMBER("Bomber",
      "Be with the President",
      "You are a primary character. Everyone in the same room as you at the end of the game dies! The Red Team wins if the president dies!",
      "bomber_red", Team.RED),
  GAMBLER("Gambler",
      "Guess if Red, Blue or Neither team won",
      "At the end of the last round, you will publically announce which team you think won the game. You only win if you are correct",
      "gambler", Team.GREY),
  BLUE_TEAM("Blue Team",
      "Keep the President away from the Bomber",
      "You are on the blue team. You win if the president doesn't die",
      "blue", Team.BLUE),
  RED_TEAM("Red Team",
      "Get the Bomber to be with the President",
      "You are on the red team. You win if the president dies!", "red",
      Team.RED);

  private final String title;
  private final String subtitle;
  private final String howToWin;
  private final String cardImage;
  private final Team team;
}

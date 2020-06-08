package me.ajfleming.tworoomsio.model;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Card {
	PRESIDENT( "President",
			"You are a primary character. The blue team wins if you do not gain the 'dead' condition",
			"president_blue", Team.BLUE ),
	BOMBER( "Bomber",
			"You are a primary character. Everyone in the same room as you at the end of the game dies! The Red Team wins if the president dies!",
			"bomber_red", Team.RED ),
	GAMBLER( "Gambler",
			"At the end of the last round, you will publically announce which team you think won the game. You only win if you are correct",
			"gambler", Team.GREY ),
	BLUE_TEAM( "Blue Team", "You are on the blue team. You win if the president doesn't die",
			"blue", Team.BLUE ),
	RED_TEAM( "Red Team", "You are on the red team. You win if the president dies!", "red",
			Team.RED );

	private final String title;
	private final String howToWin;
	private final String cardImage;
	private final Team team;

	Card( String title, String howToWin, String cardImage, Team team ) {
		this.title = title;
		this.howToWin = howToWin;
		this.cardImage = cardImage;
		this.team = team;
	}

	public String getTitle() {
		return title;
	}

	public String getHowToWin() {
		return howToWin;
	}

	public String getCardImage() {
		return cardImage;
	}

	public Team getTeam() {
		return team;
	}
}

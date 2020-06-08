package me.ajfleming.tworoomsio.model;

public class Card {
	private String title;
	private String howToWin;
	private String cardImageKey;
	private Team team;

	public Card( String title, String howToWin, String cardImageKey, Team team ) {
		this.title = title;
		this.howToWin = howToWin;
		this.cardImageKey = cardImageKey;
		this.team = team;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle( final String title ) {
		this.title = title;
	}

	public String getHowToWin() {
		return howToWin;
	}

	public void setHowToWin( final String howToWin ) {
		this.howToWin = howToWin;
	}

	public String getCardImageKey() {
		return cardImageKey;
	}

	public void setCardImageKey( final String cardImageKey ) {
		this.cardImageKey = cardImageKey;
	}

	public Team getTeam() {
		return team;
	}

	public void setTeam( final Team team ) {
		this.team = team;
	}
}

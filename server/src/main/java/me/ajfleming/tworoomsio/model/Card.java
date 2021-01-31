package me.ajfleming.tworoomsio.model;

public class Card {
	private CardKey key;
	private String title;
	private String subtitle;
	private String howToWin;
	private String cardImage;
	private Team team;

	public Card( CardKey key, CardInfo cardInfo ) {
		this.key = key;
		this.title = cardInfo.getTitle();
		this.subtitle = cardInfo.getSubtitle();
		this.howToWin = cardInfo.getHowToWin();
		this.cardImage = cardInfo.getCardImage();
		this.team = cardInfo.getTeam();
	}

	public Card( CardKey key, String title, String subtitle, String howToWin, String cardImage, Team team ) {
		this.key = key;
		this.title = title;
		this.subtitle = subtitle;
		this.howToWin = howToWin;
		this.cardImage = cardImage;
		this.team = team;
	}

	public CardKey getKey() {
		return key;
	}

	public void setKey( final CardKey key ) {
		this.key = key;
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

	public String getCardImage() {
		return cardImage;
	}

	public void setCardImage( final String cardImage ) {
		this.cardImage = cardImage;
	}

	public Team getTeam() {
		return team;
	}

	public void setTeam( final Team team ) {
		this.team = team;
	}

	public String getSubtitle() {
		return subtitle;
	}

	public void setSubtitle( final String subtitle ) {
		this.subtitle = subtitle;
	}
}

package me.ajfleming.tworoomsio.model;

public class CardAssignment {
	private String player;
	private Card card;

	public CardAssignment( String playerToken, Card card ) {
		this.player = playerToken;
		this.card = card;
	}

	public String getPlayer() {
		return player;
	}

	public void setPlayer( final String player ) {
		this.player = player;
	}

	public Card getCard() {
		return card;
	}

	public void setCard( final Card card ) {
		this.card = card;
	}
}

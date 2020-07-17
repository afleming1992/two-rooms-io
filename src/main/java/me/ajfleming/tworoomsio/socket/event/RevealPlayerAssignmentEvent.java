package me.ajfleming.tworoomsio.socket.event;

import me.ajfleming.tworoomsio.model.CardKey;

public class RevealPlayerAssignmentEvent {
	CardKey card;

	public CardKey getCard() {
		return card;
	}

	public void setCard( final CardKey card ) {
		this.card = card;
	}
}

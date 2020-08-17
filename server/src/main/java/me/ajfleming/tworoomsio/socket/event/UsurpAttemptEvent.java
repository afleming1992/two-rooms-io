package me.ajfleming.tworoomsio.socket.event;

import me.ajfleming.tworoomsio.model.User;

public class UsurpAttemptEvent {
	private User initiator;
	private User nominee;

	public UsurpAttemptEvent( User initiator, User nominee ) {
		this.initiator = initiator;
		this.nominee = nominee;
	}

	public User getInitiator() {
		return initiator;
	}

	public void setInitiator( final User initiator ) {
		this.initiator = initiator;
	}

	public User getNominee() {
		return nominee;
	}

	public void setNominee( final User nominee ) {
		this.nominee = nominee;
	}
}

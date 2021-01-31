package me.ajfleming.tworoomsio.model.room;

public enum LeadershipVote {
	AGREED("agreed"),
	NOT_AGREED("not_agreed");

	String value;

	LeadershipVote( String value ) {
 		this.value = value;
	}

	public String getValue() {
		return value;
	}
}

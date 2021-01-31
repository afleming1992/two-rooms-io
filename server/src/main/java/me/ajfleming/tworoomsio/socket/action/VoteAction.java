package me.ajfleming.tworoomsio.socket.action;

import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class VoteAction {
	RoomName room;
	LeadershipVote answer;

	public RoomName getRoom() {
		return room;
	}

	public void setRoom( final RoomName room ) {
		this.room = room;
	}

	public LeadershipVote getAnswer() {
		return answer;
	}

	public void setAnswer( final LeadershipVote answer ) {
		this.answer = answer;
	}
}

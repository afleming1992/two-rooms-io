package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.socket.action.NominateAction;
import me.ajfleming.tworoomsio.socket.action.VoteAction;

public class RoomEventListeners {
	private final UserActionController userActionController;

	public RoomEventListeners( UserActionController userActionController ) {
		this.userActionController = userActionController;
	}

	@OnEvent("NOMINATE_LEADER")
	void onNominateLeader( SocketIOClient client, NominateAction action ) {
		userActionController.nominateLeader( client, action );
	}

	@OnEvent("NOMINATE_HOSTAGE")
	void onNominateHostage( SocketIOClient client, NominateAction action ) {
		userActionController.nominateHostage( client, action );
	}

	@OnEvent("ABDICATE_AS_LEADER")
	void onAbdicateAsLeader( SocketIOClient client, NominateAction action ) {
		userActionController.abdicateAsLeader( client, action );
	}

	@OnEvent("ANSWER_LEADERSHIP_OFFER")
	void onAnswerLeadershipOffer( SocketIOClient client, VoteAction action ) {
		userActionController.answerLeadershipOffer( client, action );
	}

	@OnEvent("USURP_LEADER")
	void onUsurpLeader( SocketIOClient client, NominateAction action ) {
		userActionController.usurpLeader( client, action );
	}

	@OnEvent("USURP_VOTE")
	void onUsurpVote( SocketIOClient client, VoteAction action ) {
		userActionController.usurpVote( client, action );
	}
}

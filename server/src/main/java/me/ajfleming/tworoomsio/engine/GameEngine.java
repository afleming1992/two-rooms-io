package me.ajfleming.tworoomsio.engine;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;

/**
 * Responsible for taking effects triggered by users and applying them to the Game
 */
public interface GameEngine {
	void createNewGame( User hostUser ) throws GameException;

	String addPlayerToGame( User user ) throws GameException;

	void reloadPlayerIntoGame( String gameToken, User user ) throws GameException;

	void disconnectPlayer( User user );

	// Host Operations

	void startGame( User user ) throws GameException;

	void endRound( User user ) throws GameException;

	void nextRound( User requestor ) throws GameException;

	void startTimer( User requestor );

	void pauseTimer( User requestor );

	void restartTimer( User requestor );

	// Card Sharing Operations

	CardShareRequest requestShare( User requestor, CardShareRequest request ) throws GameException;

	void privateReveal( User requestor, CardShareRequest request ) throws GameException;

	void acceptShare( User user, String requestId ) throws GameException;

	void rejectShare( User user, String requestId ) throws GameException;

	void revealCardAssignment( User user, CardKey card ) throws GameException;

	// Room Operations

	void nominateLeader( RoomName room, User nominator, User nominee ) throws GameException;

	void nominateHostage( RoomName room, User leader, User hostage ) throws GameException;

	void performHostageSwitch( User host ) throws GameException;

	void abdicateAsLeader( RoomName room, User leader, User replacement ) throws GameException;

	void acceptLeadership( RoomName room, User newLeader ) throws GameException;

	void declineLeadership( RoomName room, User decliner) throws GameException;

	void beginUsurp( RoomName room, User usurper, User leadershipNominee ) throws GameException;

	void leadershipVote( RoomName room, User voter, LeadershipVote vote ) throws GameException;

	void resolveLeadershipVote( RoomName roomName, LeadershipVote agreed );
}


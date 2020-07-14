package me.ajfleming.tworoomsio.engine;

import java.util.Optional;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.ShareDecision;

/**
 * Responsible for taking effects triggered by users and applying them to the Game
 */
public interface GameEngine {
	void createNewGame( User hostUser ) throws GameException;

	String addPlayerToGame( User user ) throws GameException;

	void reloadPlayerIntoGame( String gameToken, User user ) throws GameException;

	void disconnectPlayer( User user );

	void nextRound( User requestor ) throws GameException;

	void startTimer( User requestor );

	void pauseTimer( User requestor );

	void restartTimer( User requestor );

	CardShareRequest requestShare( User requestor, CardShareRequest request ) throws GameException;

	void privateReveal( User requestor, CardShareRequest request ) throws GameException;

	void acceptShare( User user, String requestId ) throws GameException;

	void rejectShare( User user, String requestId ) throws GameException;

	void revealCardAssignment( User user, Card card ) throws GameException;
}


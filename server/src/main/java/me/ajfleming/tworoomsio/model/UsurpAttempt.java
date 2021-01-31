package me.ajfleming.tworoomsio.model;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import me.ajfleming.tworoomsio.engine.GameEngine;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;

public class UsurpAttempt {
	RoomName roomName;
	User initiator;
	User nominee;
	List<User> validVoters;
	GameEngine gameEngine;
	long majority;

	private int secondsLeft;

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private ScheduledFuture<?> refreshTask;

	Map<String, LeadershipVote> votes;

	public UsurpAttempt( RoomName roomName, User initiator, User nominee, List<User> validVoters, GameEngine gameEngine ) {
		this.initiator = initiator;
		this.nominee = nominee;
		this.validVoters = validVoters;
		this.gameEngine = gameEngine;
	}

	public void initiateUsurpVote() {
		this.majority = calculateMajority();
		timerStart();
	}

	private long calculateMajority() {
		return ( validVoters.size() ) / 2 + 1;
	}

	public void registerVote( User voter, LeadershipVote vote ) throws GameException {
		if ( isValidVoter( voter ) ) {
			votes.put( voter.getUserToken(), vote );
		} else {
			throw new GameException("You are not eligible to vote in this vote");
		}
	}

	private boolean isValidVoter( User voter ) {
		return validVoters.stream().anyMatch( user -> user.is( voter ) );
	}

	public void resolveVote() {
		long totalUsurpVotes = votes.values().stream().filter( vote -> vote == LeadershipVote.AGREED ).count();
		if ( totalUsurpVotes >= majority ) {
			gameEngine.resolveLeadershipVote( this.roomName, LeadershipVote.AGREED );
		} else {
			gameEngine.resolveLeadershipVote( this.roomName, LeadershipVote.NOT_AGREED );
		}
	}

	private void timerStart() {
		final Runnable refresh = () -> {
			secondsLeft--;
			if( secondsLeft < 1 ) {
				resolveVote();
				refreshTask.cancel( true );
			}
		};
		refreshTask = scheduler.scheduleAtFixedRate( refresh, 0, 1, TimeUnit.SECONDS );
	}

	private void stopTimer() {
		if( refreshTask != null ) {
			refreshTask.cancel( true );
		}
	}

	public User getNominee() {
		return nominee;
	}

	public void setNominee( final User nominee ) {
		this.nominee = nominee;
	}

	public User getInitiator() {
		return initiator;
	}

	public void setInitiator( final User initiator ) {
		this.initiator = initiator;
	}
}

package me.ajfleming.tworoomsio.model.room;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.UsurpAttempt;

public class Room {
	@JsonIgnore
	private String channelName;
	private RoomName roomName;
	private List<User> players;
	private User leader;
	private LinkedList<User> hostages;
	private User replacementLeader;
	private UsurpAttempt usurpAttempt;

	public void newRound() {
		this.hostages = new LinkedList<>();
	}

	public void addPlayer( User user ) {
		if ( this.players == null ) {
			this.players = new ArrayList<>();
		}

		user.getClient().joinRoom( channelName );
		user.getClient().sendEvent( "JOIN_ROOM", roomName );

		this.players.add( user );
	}

	public void addPlayers( List<User> users ) {
		if ( this.players == null ) {
			this.players = new ArrayList<>();
		}

		for ( User user : users ) {
			user.getClient().joinRoom( channelName );
			user.getClient().sendEvent( "JOIN_ROOM", roomName );
		}

		this.players.addAll( users );
	}

	public void removePlayer( String token ) {
		Optional<User> player = this.players.stream()
				.filter( user -> user.getUserToken().equals( token ) )
				.findFirst();

		if ( player.isPresent() ) {
			this.players = this.players.stream()
					.filter( user -> !user.getUserToken().equals( token ) )
					.collect( Collectors.toList() );
			player.get().getClient().leaveRoom( channelName );
		}
	}

	public List<User> removeHostages() {
		for( User hostage : hostages ) {
			removePlayer( hostage.getUserToken() );
		}

		return hostages;
	}

	public boolean isPlayerInRoom( User player ) {
		return players.stream().anyMatch( user -> player.getUserToken().equals( user.getUserToken() ) );
	}

	ReentrantLock firstLeaderLock = new ReentrantLock(true);

	public void setFirstLeader( User leader ) throws GameException {
		firstLeaderLock.lock();
		try {
			if( leader != null ) {
				this.leader = leader;
			} else {
				throw new GameException("Leader has already been assigned");
			}
		} finally {
			firstLeaderLock.unlock();
		}
	}

	public void nominateHostage( User newHostage, int maxHostages ) throws GameException {
		boolean currentHostage = hostages.stream().anyMatch( hostage -> newHostage.getUserToken().equals( hostage.getUserToken() ) );
		if ( currentHostage ) {
			throw new GameException(newHostage.getName() + "is already a hostage");
		}

		hostages.add( newHostage );
		if( hostages.size() > maxHostages ) {
			hostages.pollFirst();
		}
	}

	public UsurpAttempt getUsurpAttempt() {
		return usurpAttempt;
	}

	public void setUsurpAttempt( final UsurpAttempt usurpAttempt ) {
		this.usurpAttempt = usurpAttempt;
	}

	public void setChannelName( String gameId ) {
		channelName = "game/" + gameId + "/room/" + roomName;
	}

	public String getChannelName() {
		return channelName;
	}

	public RoomName getRoomName() {
		return roomName;
	}

	public void setRoomName( final RoomName roomName ) {
		this.roomName = roomName;
	}

	public List<User> getPlayers() {
		return players;
	}

	public void setPlayers( final List<User> players ) {
		this.players = players;
	}

	public User getLeader() {
		return leader;
	}

	public void setLeader( final User leader ) {
		this.leader = leader;
	}

	public boolean isPlayerLeader( final User leader ) {
		return this.leader.getUserToken().equals( leader.getUserToken() );
	}

	public List<User> getHostages() {
		return this.hostages;
	}

	public void setReplacementLeader( final User replacement ) {
		this.replacementLeader = replacement;
	}

	public User getReplacementLeader() {
		return this.replacementLeader;
	}
}

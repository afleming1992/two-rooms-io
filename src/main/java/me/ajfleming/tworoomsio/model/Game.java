package me.ajfleming.tworoomsio.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.timer.RoundTimer;

public class Game {
	private String id;
	private User host;
	private int round;
	private List<User> players;
	private List<Card> deck;
	@JsonIgnore
	private Map<String, Card> roleAssignments;
	@JsonIgnore
	private Map<String, CardShareRequest> cardShareRequests;
	private RoundTimer timer;
	private List<Round> roundData;

	public boolean addPlayer( User user ) {
		return this.players.add( user );
	}

	public boolean reconnectPlayer( User reconnectingUser ) {
		AtomicBoolean reconnected = new AtomicBoolean( false );

		this.players.stream().filter( user -> user.is( reconnectingUser ) ).forEach( user -> {
			user.reconnectPlayer( reconnectingUser.getClient() );
			reconnected.set( true );
		} );

		return reconnected.get();
	}

	public void removePlayer( User playerToRemove ) {
		this.players = this.players.stream()
				.filter( user -> user.is( playerToRemove ) )
				.collect( Collectors.toList() );
	}

	public void addShareRequest( final CardShareRequest request ) throws GameException {
		cardShareRequests.put( request.getId(), request );
	}

	public Optional<CardShareRequest> getCardShareRequest( final String requestId ) throws GameException {
		return Optional.ofNullable( cardShareRequests.get( requestId ) );
	}

	public boolean invalidateCardShareRequest( final String requestId ) {
		return cardShareRequests.remove( requestId ) != null;
	}

	public Optional<User> findPlayer( String name ) {
		return players.stream().filter( user -> user.getName().equals( name ) ).findFirst();
	}

	public Optional<User> findPlayerByUserToken( String token ) {
		return players.stream().filter( user -> user.getUserToken().equals( token ) ).findFirst();
	}

	public Optional<User> findPlayerBySocketSessionId( String sessionId ) {
		return players.stream()
				.filter( user -> user.getSocketSessionId().equals( sessionId ) )
				.findFirst();
	}

	public void disconnectPlayer( final String sessionId ) {
		Optional<User> search = findPlayerBySocketSessionId( sessionId );
		if ( search.isPresent() ) {
			if ( hasStarted() || isUserHost( search.get() ) ) {
				// Soft Disconnect the User (Mark as Disconnected)
				this.players.stream().forEach( user -> {
					if ( user.getSocketSessionId().toString().equals( sessionId ) ) {
						user.disconnectPlayer();
					}
				} );
			} else {
				// Hard Disconnect the user (Remove them completely)
				this.players = this.players.stream()
						.filter( user -> !user.getSocketSessionId().equals( sessionId ) )
						.collect( Collectors.toList() );
			}
		}
	}

	public boolean hasStarted() {
		return round > 0;
	}

	public Optional<Card> getRoleAssignmentForUser( final String userToken ) {
		Card card = roleAssignments.get( userToken );
		if ( card != null ) {
			return Optional.of( card );
		} else {
			return Optional.empty();
		}
	}

	public boolean isUserHost( final User user ) {
		return host.getUserToken().equals( user.getUserToken() );
	}

	public String getId() {
		return id;
	}

	public User getHost() {
		return host;
	}

	public int getRound() {
		return round;
	}

	public List<User> getPlayers() {
		return players;
	}

	public List<Card> getDeck() {
		return deck;
	}

	public void setDeck( final List<Card> deck ) {
		this.deck = deck;
	}

	public Map<String, Card> getRoleAssignments() {
		return roleAssignments;
	}

	public void setRoleAssignments( final Map<String, Card> roleAssignments ) {
		this.roleAssignments = roleAssignments;
	}

	public int getTotalPlayerCount() {
		return players.size();
	}

	public void nextRound() {
		round++;
	}

	public RoundTimer getTimer() {
		return timer;
	}

	public void setTimer( RoundTimer timer ) {
		this.timer = timer;
	}

	public List<Round> getRoundData() {
		return roundData;
	}

	public void setRoundData( List<Round> roundData ) {
		this.roundData = roundData;
	}

	public static class Builder {
		private final Game template;

		public Builder() {
			template = new Game();
		}

		public Builder newGame( User host ) {
			template.id = UUID.randomUUID().toString();
			template.host = host;
			template.round = 0;
			template.players = new ArrayList<>();
			template.deck = new ArrayList<>();
			template.cardShareRequests = new HashMap<>();
			return this;
		}

		public Game build() {
			Game game = new Game();
			game.id = template.id;
			game.host = template.host;
			game.round = template.round;
			game.players = template.players;
			game.deck = template.deck;
			game.cardShareRequests = template.cardShareRequests;
			return game;
		}
	}
}

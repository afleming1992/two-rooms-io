package me.ajfleming.tworoomsio.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
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

	public Game( User host ) {
		this.host = host;
		this.setupGame();
	}

	public void setupGame() {
		this.id = UUID.randomUUID().toString();
		this.round = 0;
		this.players = new ArrayList<>();
		this.deck = new ArrayList<>();
		this.cardShareRequests = new HashMap<>();
	}

	public boolean addPlayer( User user ) throws GameException {
		if ( round > 0 ) {
			throw new GameException( "Game has already started" );
		}

		if ( findPlayer( user.getName() ).isPresent() ) {
			throw new GameException( "Someone has already used that name! Maybe you have a popular name like Andrew? 🤔" );
		}

		players.add( user );
		return true;
	}

	public User addShareRequest( final CardShareRequest request ) throws GameException {
		if ( timer.getTimerRunning() ) {
			Optional<User> playerFindResult = findPlayerByUserToken( request.getRecipient() );
			if ( playerFindResult.isPresent() ) {
				cardShareRequests.put( request.getId(), request );
				return playerFindResult.get();
			} else {
				throw new GameException("That user seems to have gone walkies... or maybe the user didn't exist in the first place 🤔");
			}
		} else {
			throw new GameException("Card Shares are blocked whilst timer is not running");
		}
	}

	public CardShareRequest getCardRequestIfAllowed( final String requestId ) throws GameException {
		if ( timer.getTimerRunning() ) {
			CardShareRequest request = cardShareRequests.remove( requestId );
			if ( request != null) {
				return request;
			} else {
				throw new GameException("Card share is no longer valid");
			}
		} else {
			throw new GameException("Card shares are blocked whilst timer is not running");
		}
	}

	public Optional<User> findPlayer( String name ) {
		return players.stream().filter( user -> user.getName().equals( name ) ).findFirst();
	}

	public Optional<User> findPlayerByUserToken( String token ) {
		return players.stream().filter( user -> user.getUserToken().equals( token ) ).findFirst();
	}

	public void disconnectPlayer( final UUID sessionId ) {
		this.players = players.stream().filter( user -> !user.getClient().getSessionId().equals( sessionId ) ).collect( Collectors.toList() );
		if( isUserHost( sessionId ) && players.size() > 0 ) {
			// Promote new player to Host
			this.host = players.get( 0 );
		}
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

	public boolean isUserHost( final UUID sessionId ) {
		return host.getSocketSessionId().equals( sessionId );
	}

	public void setDeck( final List<Card> deck ) {
		this.deck = deck;
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

	public void setTimer( RoundTimer timer ) {
		this.timer = timer;
	}

	public RoundTimer getTimer() {
		return timer;
	}
}

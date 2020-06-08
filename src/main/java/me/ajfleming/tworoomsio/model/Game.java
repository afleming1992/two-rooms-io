package me.ajfleming.tworoomsio.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import me.ajfleming.tworoomsio.exception.GameException;

public class Game {
	private String id;
	private final User host;
	private int round;
	private List<User> players;
	private List<Card> deck;

	public Game( User host ) {
		this.host = host;
		this.setupGame();
	}

	public void setupGame() {
		this.id = UUID.randomUUID().toString();
		this.round = 0;
		this.players = new ArrayList<>();
		this.deck = new ArrayList<>();
	}

	public boolean addPlayer( User user ) throws GameException {
		if ( round > 0 ) {
			throw new GameException( "Game has already started" );
		}

		if ( findPlayer( user.getName() ).isPresent() ) {
			throw new GameException( "User with same name already exists" );
		}

		players.add( user );
		return true;
	}

	public Optional<User> findPlayer( UUID userToken ) {
		return players.stream().filter( user -> user.equals( userToken ) ).findFirst();
	}

	public Optional<User> findPlayer( String name ) {
		return players.stream().filter( user -> user.getName().equals( name ) ).findFirst();
	}

	public void disconnectPlayer( final UUID sessionId ) {
		this.players = players.stream().filter( user -> user.getClient().getSessionId().equals( sessionId ) ).collect( Collectors.toList() );
	}

	public boolean isUserHost( final User user ) {
		return host.getUserToken().equals( user.getUserToken() );
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

	public int getTotalPlayerCount() {
		return players.size();
	}
}

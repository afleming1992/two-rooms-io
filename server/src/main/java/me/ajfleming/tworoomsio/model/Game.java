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
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.timer.RoundTimer;

public class Game {
	private String id;
	private User host;
	private GameStage stage;
	private int round;
	private int numberOfRounds;
	private List<User> players;
	private List<Card> deck;
	@JsonIgnore
	private Map<String, Card> cardAssignments;
	private List<CardAssignment> revealedCardAssignments;
	@JsonIgnore
	private Map<String, CardShareRequest> cardShareRequests;
	private RoundTimer timer;
	private List<Round> roundData;
	private Map<RoomName, Room> rooms;

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

	public void disconnectPlayer( final String userToken ) {
		Optional<User> search = findPlayerByUserToken( userToken );
		if ( search.isPresent() ) {
			if ( hasStarted() || isUserHost( search.get() ) ) {
				// Soft Disconnect the User (Mark as Disconnected)
				this.players.stream().forEach( user -> {
					if ( user.getUserToken().equals( userToken ) ) {
						user.disconnectPlayer();
					}
				} );
			} else {
				// Hard Disconnect the user (Remove them completely)
				this.players = this.players.stream()
						.filter( user -> !user.getUserToken().equals( userToken ) )
						.collect( Collectors.toList() );
			}
		}
	}

	public boolean hasStarted() {
		return round > 0;
	}

	public Optional<Card> getRoleAssignmentForUser( final String userToken ) {
		Card card = cardAssignments.get( userToken );
		if ( card != null ) {
			return Optional.of( card );
		} else {
			return Optional.empty();
		}
	}

	public List<User> getUserAssignmentForCard( final CardKey card ) {
		List<String> userTokens = cardAssignments.entrySet()
				.stream()
				.filter( entry -> entry.getValue().getKey() == card )
				.map( entry -> entry.getKey() )
				.collect( Collectors.toList() );

		return players.stream()
				.filter( user -> userTokens.contains( user.getUserToken() ) )
				.collect( Collectors.toList() );
	}

	public void permanentRevealUserCard( final User player ) {
		if ( !isUserAlreadyRevealed( player ) ) {
			Card card = cardAssignments.get( player.getUserToken() );
			revealedCardAssignments.add( new CardAssignment( player.getUserToken(), card ) );
		}
	}

	public boolean isUserAlreadyRevealed( final User player ) {
		return revealedCardAssignments.stream().anyMatch( cardAssignment -> cardAssignment.getPlayer().equals( player.getUserToken() ) );
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

	public Map<String, Card> getCardAssignments() {
		return cardAssignments;
	}

	public void setCardAssignments( final Map<String, Card> cardAssignments ) {
		this.cardAssignments = cardAssignments;
	}

	public List<CardAssignment> getRevealedCardAssignments() {
		return revealedCardAssignments;
	}

	public void setRevealedCardAssignments( final List<CardAssignment> revealedCardAssignments ) {
		this.revealedCardAssignments = revealedCardAssignments;
	}

	public int getTotalPlayerCount() {
		return players.size();
	}

	public void nextRound() {
		round++;
		stage = GameStage.IN_ROUND;
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

	public int getNumberOfRounds() {
		return numberOfRounds;
	}

	public void setNumberOfRounds( final int numberOfRounds ) {
		this.numberOfRounds = numberOfRounds;
	}

	public void resetCardShares() {
		this.cardShareRequests = new HashMap<>();
	}

	public Room getRoom( RoomName roomName ) {
		return rooms.get( roomName );
	}

	public void updateRoom( Room updatedRoom ) {
		rooms.put( updatedRoom.getRoomName(), updatedRoom );
	}

	public Map<RoomName, Room> getRooms() {
		return rooms;
	}

	public void setRooms( final Map<RoomName, Room> rooms ) {
		this.rooms = rooms;
	}

	public GameStage getStage() {
		return stage;
	}

	public void setStage( final GameStage stage ) {
		this.stage = stage;
	}

	@JsonIgnore
	public int getMaxHostages() {
		if ( roundData != null ) {
			return getRoundData().get( round - 1 ).getHostagesRequired();
		} else {
			return 0;
		}
	}

	public Optional<Room> findRoomUserIsIn( final User user ) {
		return rooms.values().stream().filter( room -> room.isPlayerInRoom( user )).findFirst();
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
			template.revealedCardAssignments = new ArrayList<>();
			template.numberOfRounds = 3;
			template.stage = GameStage.CREATED;
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
			game.revealedCardAssignments = template.revealedCardAssignments;
			game.stage = template.stage;
			return game;
		}
	}
}

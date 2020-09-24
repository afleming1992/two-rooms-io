package me.ajfleming.tworoomsio.engine;

import static me.ajfleming.tworoomsio.timer.TimerUtils.setupTimer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.exception.UserException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.GameStage;
import me.ajfleming.tworoomsio.model.RoundMap;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.UsurpAttempt;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
import me.ajfleming.tworoomsio.service.deck.DeckDealerService;
import me.ajfleming.tworoomsio.service.rooms.HostageSwitchService;
import me.ajfleming.tworoomsio.service.rooms.RoomAllocationService;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.CardShareType;
import me.ajfleming.tworoomsio.socket.event.JoinRoomEvent;
import me.ajfleming.tworoomsio.socket.event.ShowHostagesEvent;
import me.ajfleming.tworoomsio.socket.event.UsurpAttemptEvent;
import me.ajfleming.tworoomsio.socket.response.CardRevealResponse;

public class GameEngineImpl implements GameEngine {
	private Game game;
	private final SocketIOServer socketServer;
	private final DeckBuilderService deckBuilder;
	private final UserManager userManager;

	private static final int TOTAL_ROUND_SECONDS = 180;
	private static final int MAX_ROUNDS = 3;

	public GameEngineImpl( SocketIOServer socketServer, UserManager userManager ) {
		this.socketServer = socketServer;
		this.deckBuilder = new DeckBuilderService();
		this.userManager = userManager;
	}

	@Override
	public void createNewGame( final User hostUser ) throws GameException {
		if ( game == null ) {
			game = new Game.Builder().newGame( hostUser ).build();
		} else {
			throw new GameException( "Game already in progress" );
		}
	}

	@Override
	public String addPlayerToGame( final User user ) throws GameException {
		if ( game == null ) {
			createNewGame( user );
		}

		if ( game.getRound() > 0 ) {
			throw new GameException( "Game has already started" );
		}

		if ( game.findPlayer( user.getName() ).isPresent() ) {
			throw new GameException(
					"Someone has already used that name! Maybe you have a popular name like Andrew? 🤔" );
		}

		game.addPlayer( user );
		addPlayerToGameComms( user );
		game.setDeck( deckBuilder.buildDeck( game.getTotalPlayerCount() ) );
		triggerGameUpdateEvent();
		return game.getId();
	}

	@Override
	public void reloadPlayerIntoGame( String gameToken, User reconnectingUser )
			throws GameException {
		enforceGameCheck(  game != null && game.getId().equals( gameToken ), "The game you're attempting to reload into doesn't exist anymore!" );
		enforceGameCheck( game.reconnectPlayer( reconnectingUser ), "Failed to reconnect to game" );
		addPlayerToGameComms( reconnectingUser );
		try {
			reloadPlayerGameData( reconnectingUser.getClient(), reconnectingUser );
		} catch ( UserException e ) {
			throw new GameException("Failed to reload user into game");
		}

		triggerGameUpdateEvent();
	}

	@Override
	public void disconnectPlayer( final User user ) {
		if ( game != null ) {
			game.disconnectPlayer( user.getUserToken() );
			if ( game.getPlayers().size() > 0 ) {
				triggerGameUpdateEvent();
			} else {
				// Shutdown Game
				game = null;
			}
		}
	}

	// Game Management Operations

	public void startGame( final User requestor ) throws GameException {
		enforceGameCheck( isGameReadyToStart(), "Game cannot be currently started");
		enforceGameCheck( game.isUserHost( requestor ), "User is not host" );
		game.setRooms( RoomAllocationService.generateAndAllocateToRooms( game ) );
		game.setRoundData( RoundMap.getRoundData( game.getTotalPlayerCount() ) );
		game.setStage( GameStage.FIRST_ROOM_ALLOCATION );
		triggerGameUpdateEvent();
	}

	private boolean isGameReadyToStart() {
		return game.getDeck().size() == game.getPlayers().size();
	}

	@Override
	public void endRound( final User requestor ) throws GameException {
		enforceGameCheck( game.isUserHost( requestor ), "User is not host" );
		enforceGameCheck( !game.getTimer().isTimerRunning(), "Timer must not be running in order to proceed" );
		enforceGameCheck( checkHostageCounts(), "Not enough hostages" );
		game.setStage( GameStage.END_OF_ROUND );
		triggerGameUpdateEvent();
		sendEventToGame( "REVEAL_HOSTAGES", new ShowHostagesEvent( game.getRooms() ) );
	}

	public boolean checkHostageCounts() {
		for ( Room room : game.getRooms().values() ) {
			if ( room.getHostageCount() != game.getMaxHostages() ) {
				return false;
			}
		}
		return true;
	}

	@Override
	public void nextRound( final User requestor ) throws GameException {
		if( game.isUserHost( requestor ) ) {
			if ( game.getRound() >= MAX_ROUNDS ) {
				endGameAndCalculateResults();
			} else {
				if ( game.getRound() == 0 ) {
					// Deal Cards for First Round
					game.setCardAssignments( DeckDealerService.dealDeck( game.getDeck(), game.getPlayers() ) );
				}
				game.nextRound();
				game.setTimer( setupTimer( TOTAL_ROUND_SECONDS, game.getId(), socketServer ) );
				game.setStage( GameStage.IN_ROUND );
				clearEventsAndRequests();
				triggerGameUpdateEvent();
			}
		}
	}

	private void clearEventsAndRequests() throws GameException {
		sendEventToGame( "CLEAR_EVENTS", null );
		game.resetCardShares();
	}

	@Override
	public void startTimer( final User requestor ) {
		if ( game.isUserHost( requestor ) ) {
			game.getTimer().start();
		}
	}

	@Override
	public void pauseTimer( final User requestor ) {
		if ( game.isUserHost( requestor ) ) {
			game.getTimer().stop();
		}

	}

	@Override
	public void restartTimer( final User requestor ) {
		if ( game.isUserHost( requestor ) ) {
			if ( game.getTimer().isTimerRunning() ) {
				game.getTimer().stop();
			}

			game.setTimer( setupTimer( TOTAL_ROUND_SECONDS, game.getId(), socketServer ) );
		}
		triggerGameUpdateEvent();
	}

	@Override
	public void revealCardAssignment( final User host, final CardKey card ) throws GameException {
		if ( game.isUserHost( host ) ) {
			List<User> users = game.getUserAssignmentForCard( card );
			if ( users.size() > 0 ) {
				for ( User user : users ) {
					game.permanentRevealUserCard( user );
				}
			} else {
				throw new GameException( String.format("Card %s doesn't have a player assigned to it", card) );
			}
		}
		triggerGameUpdateEvent();
	}

	@Override
	public void nominateLeader( final RoomName roomName, final User nominator, final User nominee ) throws GameException {
		Room room = game.getRoom( roomName );
		if ( room.isPlayerInRoom( nominator ) && room.getLeader() == null ) {
			room.setFirstLeader( nominee );
			game.updateRoom( room );
			sendEventToRoom( room, "NEW_LEADER", nominee.getUserToken() );
		} else {
			throw new GameException("Invalid operation");
		}
	}

	@Override
	public void nominateHostage( final RoomName roomName, final User leader, final User hostage )
			throws GameException {
		Room room = game.getRoom( roomName );
		if ( room.isPlayerLeader( leader ) && !room.isPlayerLeader( hostage )) {
			room.nominateHostage( hostage, game.getMaxHostages() );
			game.updateRoom( room );
			sendEventToRoom( room, "HOSTAGE_UPDATE", room.getHostages() );
		} else {
			throw new GameException( "You are currently not the leader of the room" );
		}
	}

	@Override
	public void performHostageSwitch( final User host ) throws GameException {
		if ( game.isUserHost( host ) ) {
			HostageSwitchService.performHostageSwitch( game );
		}
	}

	@Override
	public void abdicateAsLeader( final RoomName roomName, final User leader, final User replacement )
			throws GameException {
		Room room = game.getRoom( roomName );
		if ( room.isPlayerLeader( leader ) ) {
			room.setReplacementLeader( replacement );
			replacement.sendEvent( "ROOM_LEADER_OFFER", roomName );
		} else {
			throw new GameException("You are currently not the room leader!");
		}
	}

	@Override
	public void acceptLeadership( final RoomName roomName, final User newLeader )
			throws GameException {
		Room room = game.getRoom( roomName );
		if ( room.getReplacementLeader().is( newLeader ) && game.getTimer().isTimerRunning() ) {
			room.setReplacementLeader( null );
			room.setLeader( newLeader );
			game.updateRoom( room );
			sendEventToRoom( room, "LEADER_UPDATE", newLeader.getUserToken() );
		} else {
			throw new GameException("You aren't currently the leaders nominee");
		}
	}

	@Override
	public void declineLeadership( final RoomName roomName, final User decliner )
			throws GameException {
		Room room = game.getRoom( roomName );
		if ( room.getReplacementLeader().is( decliner ) ) {
			room.setReplacementLeader( null );
			room.getReplacementLeader().sendEvent( "ABDICATE_DECLINED", decliner.getName() + " did not accept room leadership" );
		}
	}

	@Override
	public void beginUsurp( final RoomName roomName, final User usurper, final User leadershipNominee )
			throws GameException {
		Room room = game.getRoom( roomName );
		if ( room.isPlayerInRoom( usurper ) && room.isPlayerInRoom( leadershipNominee ) ) {
			if ( room.getUsurpAttempt() == null ) {
				UsurpAttempt usurpAttempt = new UsurpAttempt( roomName, usurper, leadershipNominee, room.getPlayers(), this );
				room.setUsurpAttempt( usurpAttempt );
				sendEventToRoom( room, "USURP_ATTEMPT", new UsurpAttemptEvent( usurper, leadershipNominee ) );
				usurpAttempt.initiateUsurpVote();
			} else {
				throw new GameException("A usurp attempt is already in progress");
			}
		} else {
			throw new GameException("You can only usurp in your own room");
		}
	}

	@Override
	public void leadershipVote( final RoomName roomName, final User voter, final LeadershipVote vote )
			throws GameException {
		Room room = game.getRoom( roomName );
		UsurpAttempt attempt = room.getUsurpAttempt();
		if( attempt != null ) {
			attempt.registerVote( voter, vote );
		}
	}

	@Override
	public void resolveLeadershipVote( final RoomName roomName, final LeadershipVote result ) {
		Room room = game.getRoom( roomName );
		UsurpAttempt attempt = room.getUsurpAttempt();
		if ( attempt != null ) {
			if ( result == LeadershipVote.AGREED ) {
				room.setLeader( room.getUsurpAttempt().getNominee() );
				sendEventToRoom( room, "USURP_ATTEMPT_SUCCESSFUL", new UsurpAttemptEvent( attempt.getInitiator(), attempt.getNominee() ) );
			} else {
				room.setUsurpAttempt( null );
				sendEventToRoom( room, "USURP_ATTEMPT_FAILED", new UsurpAttemptEvent( attempt.getInitiator(), attempt.getNominee() ) );
			}
		}
	}

	// Sharing Operations

	@Override
	public CardShareRequest requestShare( final User requestor, final CardShareRequest request ) throws GameException {
		if ( game.getTimer().isTimerRunning() ) {
			Optional<User> recipient = game.findPlayerByUserToken( request.getRecipient() );
			if ( recipient.isPresent() ) {
				request.setId( UUID.randomUUID().toString() );
				game.addShareRequest( request );
				try {
					userManager.sendEvent( recipient.get().getUserToken(), "SHARE_REQUEST_RECEIVED",
							request );
				} catch ( UserException e ) {
					throw new GameException( e.getMessage() );
				}
				return request;
			} else {
				throw new GameException("Selected Player is not in the game");
			}
		} else {
			throw new GameException("Card shares are blocked whilst timer is not running");
		}
	}

	@Override
	public void privateReveal( final User requestor, final CardShareRequest request )
			throws GameException {
		if ( game.getTimer().isTimerRunning() ) {
			Optional<User> user = game.findPlayerByUserToken( request.getRecipient() );
			if ( user.isPresent() ) {
				sendCardDataToPlayer( request, user.get(), requestor );
			} else {
				throw new GameException( "Failed to accept Private Reveal. Requestor isn't currently online" );
			}
		} else {
			throw new GameException( "Reveals can only occur whilst the timer is running" );
		}
	}

	@Override
	public void acceptShare( final User recipient, final String requestId ) throws GameException {
		CardShareRequest request = confirmIfShareAnswerIsAllowed( recipient, requestId );

		Optional<User> requestor = game.findPlayerByUserToken( request.getRequestor() );
		if ( requestor.isPresent() ) {
			sendCardDataToPlayer( request, requestor.get(), recipient );
			sendCardDataToPlayer( request, recipient, requestor.get() );
			game.invalidateCardShareRequest( request.getId() );
		} else {
			throw new GameException(
					"Failed to accept Card Share. Requestor isn't currently online" );
		}
	}

	@Override
	public void rejectShare( final User recipient, final String requestId ) throws GameException {
		CardShareRequest request = confirmIfShareAnswerIsAllowed( recipient, requestId );

		Optional<User> requestor = game.findPlayerByUserToken( request.getRequestor() );
		if ( requestor.isPresent() ) {
			try {
				userManager.sendEvent( requestor.get().getUserToken(), "SHARE_REQUEST_REJECTED", request );
			} catch ( UserException e ) {
				throw new GameException( e.getMessage() );
			}
		}

		game.invalidateCardShareRequest( request.getId() );
	}

	private CardShareRequest confirmIfShareAnswerIsAllowed( User recipient, String requestId ) throws GameException {
		if ( game.getTimer().isTimerRunning() ) {
			Optional<CardShareRequest> cardShareRequest = game.getCardShareRequest( requestId );
			if ( cardShareRequest.isPresent() && cardShareRequest.get().getRecipient().equals( recipient.getUserToken() ) ) {
				return cardShareRequest.get();
			} else {
				throw new GameException("Card share request is no longer valid");
			}
		} else {
			throw new GameException("Card Share Answers are only accepted whilst the timer is running...");
		}
	}

	private void sendCardDataToPlayer( final CardShareRequest request, final User userToSend, final User cardOwner ) throws GameException {
		CardRevealResponse event;
		Optional<Card> card = game.getRoleAssignmentForUser( cardOwner.getUserToken() );

		if ( card.isPresent() ) {
			String eventName;
			if ( request.getId() != null && !request.getId().isEmpty() ) {
				eventName = "CARD_SHARE_ACCEPTED";
			} else {
				// We set a UUID here so that the frontend can reference this event properly
				request.setId( UUID.randomUUID().toString() );
				eventName = "PRIVATE_REVEAL_RECEIVED";
			}

			if ( request.getType() == CardShareType.ROLE) {
				event = CardRevealResponse.roleShare( request.getId(), cardOwner.getUserToken(), card.get() );
			} else {
				event = CardRevealResponse.colourShare( request.getId(), cardOwner.getUserToken(), card.get() );
			}

			try {
				userManager.sendEvent( userToSend.getUserToken(), eventName, event );
			} catch ( UserException e ) {
				throw new GameException( e.getMessage() );
			}
		} else {
			throw new GameException( "Failed to find role assignment for user" );
		}
	}

	public void endGameAndCalculateResults() {
		game.setStage( GameStage.RESULTS );
		triggerGameUpdateEvent();
	}

	// Helper Methods

	private void triggerGameUpdateEvent() {
		sendEventToGame( "GAME_UPDATE", game );
	}

	private void sendEventToGame( String name, Object data ) {
		socketServer.getRoomOperations("game/"+ game.getId() ).sendEvent(name, data);
	}

	private void sendEventToRoom( Room room, String name, Object data ) {
		socketServer.getRoomOperations( room.getChannelName() ).sendEvent( name, data );
	}

	private void addPlayerToGameComms( final User user ) {
		user.getClient().joinRoom( "game/"+ game.getId() );
		addPlayerToRoomComms( user );
	}

	private void addPlayerToRoomComms( final User user ) {
		if ( game.getStage() != GameStage.CREATED ) {
			Optional<Room> roomFind = game.findRoomUserIsIn( user );
			if ( roomFind.isPresent() ) {
				user.sendEvent( "JOIN_ROOM", new JoinRoomEvent( roomFind.get().getRoomName(), "Reconnection" ) );
				user.getClient().joinRoom( roomFind.get().getChannelName() );
			}
		}
	}

	private void reloadPlayerGameData( final SocketIOClient client, final User user ) throws UserException {
		if ( game.hasStarted() ) {
			userManager.sendEvent( user.getUserToken(), "CARD_UPDATE", game.getRoleAssignmentForUser( user.getUserToken() ).get() );
		}
	}


	private void enforceGameCheck( final boolean conditionMet, final String exceptionMessage ) throws GameException {
		if( !conditionMet ) {
			throw new GameException( exceptionMessage );
		}
	}
}
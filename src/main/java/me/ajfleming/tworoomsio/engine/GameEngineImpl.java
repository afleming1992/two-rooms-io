package me.ajfleming.tworoomsio.engine;

import static me.ajfleming.tworoomsio.timer.TimerUtils.setupTimer;

import java.util.Optional;
import java.util.UUID;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.exception.UserException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.RoundMap;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
import me.ajfleming.tworoomsio.service.deck.DeckDealerService;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.CardShareType;
import me.ajfleming.tworoomsio.socket.response.CardRevealResponse;

public class GameEngineImpl implements GameEngine {
	private Game game;
	private final SocketIOServer socketServer;
	private DeckBuilderService deckBuilder;
	private UserManager userManager;

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
		if ( game == null || !game.getId().equals( gameToken ) ) {
			throw new GameException(
					"The game you're attempting to reload into doesn't exist anymore!" );
		}

		if( !game.reconnectPlayer( reconnectingUser ) ) {
			throw new GameException("Failed to reconnect to game");
		}
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

	private void startGame( final User requestor ) throws GameException {
		if ( isGameReadyToStart() && game.isUserHost( requestor ) ) {
			game.nextRound();
			game.setRoundData( RoundMap.getRoundData( game.getTotalPlayerCount() ) );
			game.setRoleAssignments( DeckDealerService.dealDeck( game.getDeck(), game.getPlayers() ) );
			game.setTimer( setupTimer( TOTAL_ROUND_SECONDS, game.getId(), socketServer ) );
			triggerGameUpdateEvent();
		}
	}

	private boolean isGameReadyToStart() {
		return game.getDeck().size() == game.getPlayers().size();
	}

	@Override
	public void nextRound( final User requestor ) throws GameException {
		if( game.isUserHost( requestor ) ) {
			if ( game.getRound() == 0 ) {
				startGame( requestor );
			} else {
				game.nextRound();
				game.setTimer( setupTimer( TOTAL_ROUND_SECONDS, game.getId(), socketServer ) );
			}
			triggerGameUpdateEvent();
		}
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
			if ( request.getType() == CardShareType.ROLE) {
				event = CardRevealResponse.roleShare( request.getId(), cardOwner.getUserToken(), card.get() );
			} else {
				event = CardRevealResponse.colourShare( request.getId(), cardOwner.getUserToken(), card.get() );
			}
			String eventName = !request.getId().isEmpty() ? "CARD_SHARE_ACCEPTED" : "PRIVATE_REVEAL";

			try {
				userManager.sendEvent( userToSend.getUserToken(), eventName, event );
			} catch ( UserException e ) {
				throw new GameException( e.getMessage() );
			}
		} else {
			throw new GameException( "Failed to find role assignment for user" );
		}
	}

	// Helper Methods

	private void triggerGameUpdateEvent() {
		sendEventToGame( "GAME_UPDATE", game );
	}

	private void sendEventToGame( String name, Object data ) {
		socketServer.getRoomOperations("game/"+ game.getId() ).sendEvent(name, data);
	}

	private void addPlayerToGameComms( final User user ) {
		user.getClient().joinRoom( "game/"+ game.getId() );
	}

	private void reloadPlayerGameData( final SocketIOClient client, final User user ) throws UserException {
		if ( game.hasStarted() ) {
			userManager.sendEvent( user.getUserToken(), "CARD_UPDATE", game.getRoleAssignmentForUser( user.getUserToken() ).get() );
		}
	}
}

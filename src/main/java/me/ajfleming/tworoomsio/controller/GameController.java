package me.ajfleming.tworoomsio.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.deck.DeckDealerService;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.CardShareType;
import me.ajfleming.tworoomsio.service.sharing.ShareDecision;
import me.ajfleming.tworoomsio.socket.response.CardRevealResponse;
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse;
import me.ajfleming.tworoomsio.socket.response.RequestShareResponse;
import me.ajfleming.tworoomsio.socket.response.Response;
import me.ajfleming.tworoomsio.timer.RoundTimer;
import me.ajfleming.tworoomsio.timer.TimerTrigger;

public class GameController {
	private Game game;
	private SocketIOServer server;
	private DeckBuilderService deckBuilder;

	private static final int TOTAL_ROUND_SECONDS = 180;

	public GameController( SocketIOServer server ) {
		this.game = null;
		this.server = server;
		this.deckBuilder = new DeckBuilderService();
	}

	public void joinGame( SocketIOClient client, String name ) {
		User user = new User( name, client );
		if ( this.game == null ) {
			this.createGame( user );
		}

		try {
			game.addPlayer( user );
		} catch ( GameException e ) {
			client.sendEvent( "JOIN_GAME_ERROR", Response.error( e.getMessage() ) );
			return;
		}

		client.joinRoom( "game/" + game.getId() );
		client.sendEvent( "JOIN_GAME_SUCCESS", new JoinGameResponse( user.getUserToken().toString() ) );
		game.setDeck( deckBuilder.buildDeck( game.getTotalPlayerCount() ) );
	}

	private void createGame( final User user ) {
		this.game = new Game( user );
	}

	public void sendGameUpdate() {
		server.getRoomOperations( "game/" + game.getId() ).sendEvent( "GAME_UPDATE", game );
	}

	public void disconnectPlayer( SocketIOClient client ) {
		if ( game != null ) {
			game.disconnectPlayer( client.getSessionId() );
			if ( game.getPlayers().size() > 0 ) {
				sendGameUpdate();
			} else {
				// Shutdown Game
				game = null;
			}
		}
	}

	public void startNextRound( final SocketIOClient client ) {
		try {
			if( isSocketHost( client ) ) {
				if ( game.getRound() == 0 ) {
					startGame();
				} else {
					nextRound();
				}
				sendGameUpdate();
			}
		} catch ( GameException e ) {
			client.sendEvent( "START_ERROR", Response.error(e.getMessage()));
		}
	}

	public void startGame() throws GameException {
		verifyGameReadyToStart();
		Map<String, Card> roleAssignments = DeckDealerService.dealDeck( game.getDeck(), game.getPlayers() );
		game.nextRound();
		game.setRoleAssignments( roleAssignments );
		game.setTimer( setupTimer( TOTAL_ROUND_SECONDS ) );
	}

	public void nextRound() {
		game.nextRound();
		game.setTimer( setupTimer( TOTAL_ROUND_SECONDS ) );
	}

	private boolean isSocketHost( final SocketIOClient client ) {
		User host = game.getHost();
		if ( host != null ) {
			return client.getSessionId().equals( host.getSocketSessionId() );
		} else {
			return false;
		}
	}

	private void verifyGameReadyToStart() throws GameException {
		if ( game.getDeck().size() != game.getPlayers().size() ) {
			throw new GameException("Deck size doesn't match number of players");
		}
	}

	public void startGameTimer() {
		if ( game.getRound() > 0 && game.getRound() < 4 && game.getTimer() != null ) {
			game.getTimer().start();
		}
	}

	public void pauseGameTimer() {
		if ( game.getRound() > 0 && game.getRound() < 4 && game.getTimer() != null ) {
			game.getTimer().stop();
		}
	}

	public void restartGameTimer() {
		if ( game.getTimer().getTimerRunning() ) {
			game.getTimer().stop();
		}
		game.setTimer( setupTimer( TOTAL_ROUND_SECONDS ) );
		sendGameUpdate();
	}

	public void shareCard( final SocketIOClient client, final CardShareRequest request,
			final boolean isReveal ) {
		if ( isReveal ) {
			//TODO-Andrew reveal card logic
		} else {
			String requestKey = UUID.randomUUID().toString();
			request.setId( requestKey );
			try {
				User recipient = game.addShareRequest( request );
				if ( recipient.getClient() != null ) {
					recipient.getClient().sendEvent( "SHARE_REQUEST_RECEIVED", request );
				}
				client.sendEvent( "REQUEST_SHARE_SUCCESS", new RequestShareResponse( requestKey ) );
			} catch ( GameException e ) {
				client.sendEvent( "REQUEST_SHARE_ERROR", Response.error( e.getMessage() ) );
			}
		}
	}

	public void answerShare( final SocketIOClient client, final String requestId,
			final ShareDecision decision ) {
		try {
			CardShareRequest request = game.getCardRequestIfAllowed( requestId );
			Optional<User> requestor = game.findPlayerByUserToken( request.getRequestor() );
			Optional<User> recipient = game.findPlayerByUserToken( request.getRecipient() );
			if ( recipient.isPresent() && recipient.get()
					.getUserToken()
					.equals( request.getRequestor() ) ) {
				if ( decision == ShareDecision.ACCEPT ) {
					requestor.get()
							.sendEvent( "SHARE_REQUEST_ACCEPTED",
									new RequestShareResponse( request.getId() ) );
					performCardShare( request.getType(), requestor.get(), recipient.get() );
				} else {
					requestor.get()
							.sendEvent( "SHARE_REQUEST_REJECTED",
									new RequestShareResponse( request.getId() ) );
				}
			} else {
				client.sendEvent( "ANSWER_SHARE_ERROR",
						Response.error( "You are not the recipient of this requesst" ) );
			}
		} catch ( GameException e ) {
			client.sendEvent( "ANSWER_SHARE_ERROR", Response.error( e.getMessage() ) );
		}
	}

	private void performCardShare( final CardShareType type, final User user1, final User user2 ) {
		performCardReveal( false, type, user1, user2 );
		performCardReveal( false, type, user2, user1 );
	}

	private void performCardReveal( final boolean isReveal, final CardShareType cardShareType,
			final User revealer, final User recipient ) {
		Optional<Card> revealedCard = game.getRoleAssignmentForUser( revealer.getUserToken() );
		if ( cardShareType == CardShareType.ROLE ) {
			CardRevealResponse cardRevealResponse = isReveal ? CardRevealResponse.roleReveal(
					revealer.getUserToken(), revealedCard.get() ) : CardRevealResponse.roleShare(
					revealer.getUserToken(), revealedCard.get() );
			recipient.sendEvent( "ROLE_REVEAL", cardRevealResponse );
		} else {
			CardRevealResponse cardRevealResponse = isReveal ? CardRevealResponse.colourReveal(
					revealer.getUserToken(), revealedCard.get() ) : CardRevealResponse.colourShare(
					revealer.getUserToken(), revealedCard.get() );
			recipient.sendEvent( "COLOUR_REVEAL", cardRevealResponse );
		}
	}

	private RoundTimer setupTimer( int initialTime ) {
		return new RoundTimer( initialTime, TimeUnit.SECONDS, onTimerTick(), onTimerEnd() );
	}

	private TimerTrigger onTimerTick() {
		return ( secondsLeft ) -> {
			server.getRoomOperations( "game/" + game.getId() )
					.sendEvent( "TIMER_UPDATE", game.getTimer() );
		};
	}

	private TimerTrigger onTimerEnd() {
		return ( secondsLeft ) -> {
			server.getRoomOperations( "game/" + game.getId() ).sendEvent( "END_OF_ROUND", game.getTimer() );
		};
	}
}

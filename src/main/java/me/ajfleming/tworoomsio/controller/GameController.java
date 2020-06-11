package me.ajfleming.tworoomsio.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.deck.DeckDealerService;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
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
		client.sendEvent( "JOIN_GAME_SUCCESS", Response.success( "Joined game successfully" ) );
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
			sendGameUpdate();
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

	private RoundTimer setupTimer( int initialTime ) {
		return new RoundTimer( initialTime, TimeUnit.SECONDS, onTimerTick(), onTimerEnd() );
	}

	private TimerTrigger onTimerTick() {
		return ( secondsLeft ) -> {
			server.getRoomOperations( "game/" + game.getId() ).sendEvent( "TIMER_UPDATE", game.getTimer() );
		};
	}

	private TimerTrigger onTimerEnd() {
		return ( secondsLeft ) -> {
			server.getRoomOperations( "game/" + game.getId() ).sendEvent( "END_OF_ROUND", game.getTimer() );
		};
	}
}

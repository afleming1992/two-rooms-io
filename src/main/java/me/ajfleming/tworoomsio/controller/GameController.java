package me.ajfleming.tworoomsio.controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.deck.DeckBuilderService;
import me.ajfleming.tworoomsio.socket.response.Response;

public class GameController {
	private Game game;
	private SocketIOServer server;
	private DeckBuilderService deckBuilder;

	public GameController( SocketIOServer server ) {
		this.game = null;
		this.server = server;
		this.deckBuilder = new DeckBuilderService();
	}

	public void joinGame( SocketIOClient client, String name ) {
		User user = new User(name, client);
		if( this.game == null ) {
			this.createGame( user );
		}

		try {
			game.addPlayer( user );
		} catch ( GameException e ) {
			client.sendEvent( "JOIN_GAME_ERROR", Response.error(e.getMessage()) );
			return;
		}

		client.joinRoom( "game/" + game.getId() );

		client.sendEvent("JOIN_GAME_SUCCESS", Response.success("Joined game successfully") );

		game.setDeck( deckBuilder.buildDeckForNumberOfPlayers( game.getTotalPlayerCount() ) );
	}

	private void createGame( final User user ) {
		this.game = new Game( user );
	}

	public void sendGameUpdate() {
		server.getRoomOperations( "game/" + game.getId() ).sendEvent( "GAME_UPDATE", game );
	}

	public void disconnectPlayer( SocketIOClient client ) {
		game.disconnectPlayer( client.getSessionId() );
		sendGameUpdate();
	}
}

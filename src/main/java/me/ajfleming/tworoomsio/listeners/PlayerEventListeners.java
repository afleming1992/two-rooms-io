package me.ajfleming.tworoomsio.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.GameController;
import me.ajfleming.tworoomsio.socket.event.JoinGameEvent;

public class PlayerEventListeners {

	private static final Logger LOGGER = LoggerFactory.getLogger( HostEventListeners.class);

	private GameController gameController;

	public PlayerEventListeners( GameController gameController ) {
		this.gameController = gameController;
	}

	@OnConnect
	public void onConnect(SocketIOClient client) {
		LOGGER.info("Client Connected - "+ client.getSessionId().toString() );
	}

	@OnEvent("GET_GAME")
	public void onGetGame( SocketIOClient client) {
		LOGGER.info("Client requested Game - "+ client.getSessionId().toString() );
	}

	@OnEvent("JOIN_GAME")
	public void onJoinGame(SocketIOClient client, JoinGameEvent event) {
		gameController.joinGame( client, event.getName() );
		LOGGER.info("Client joined Game - "+ client.getSessionId().toString() );
		gameController.sendGameUpdate();
	}

	@OnEvent("REVEAL_COLOUR")
	public void onRevealColour(SocketIOClient client) {

	}

	@OnEvent("REVEAL_CARD")
	public void onRevealCard(SocketIOClient client) {

	}

	@OnDisconnect
	public void onDisconnect(SocketIOClient client) {
		LOGGER.info("Client Disconnected - "+ client.getSessionId().toString() );
		gameController.disconnectPlayer( client );
	}
}

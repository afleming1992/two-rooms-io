package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.GameController;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.service.sharing.CardShareType;

public class CardRequestListeners {
	private GameController gameController;

	public CardRequestListeners( GameController gameController ) {
		this.gameController = gameController;
	}

	@OnEvent("REQUEST_SHARE")
	public void onRequestShare( SocketIOClient client, CardShareRequest request ) {

	}

	@OnEvent("ACCEPT_SHARE")
	public void onAcceptShare( SocketIOClient client, String requestId ) {

	}

	@OnEvent("REJECT_SHARE")
	public void onRejectShare( SocketIOClient client, String requestId ) {

	}

	@OnEvent("PRIVATE_REVEAL")
	public void onPrivateReveal( SocketIOClient client,  CardShareRequest request ) {

	}

	@OnEvent("PUBLIC_REVEAL")
	public void onPublicReveal( SocketIOClient client, CardShareType type ) {

	}
}

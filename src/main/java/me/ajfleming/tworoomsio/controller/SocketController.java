package me.ajfleming.tworoomsio.controller;

import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.model.User;

public class SocketController {
	private SocketIOServer server;

	public SocketController( SocketIOServer server ) {
		this.server = server;
	}

	public void sendEvent( User user, String event, Object payload ) {
		user.getClient().sendEvent( event, payload );
	}
}

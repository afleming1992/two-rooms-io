package me.ajfleming.tworoomsio.model;

import java.util.UUID;

import com.corundumstudio.socketio.SocketIOClient;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {
	private String userToken;
	private String name;
	@JsonIgnore
	private SocketIOClient client;
	@JsonIgnore
	private boolean connected;

	public User( String name, SocketIOClient client) {
		userToken = UUID.randomUUID().toString();
		this.name = name;
		this.client = client;
		connected = true;
	}

	public void sendEvent( String eventName, Object payload ) {
		client.sendEvent( eventName, payload );
	}

	public String getUserToken() {
		return userToken;
	}

	public UUID getSocketSessionId() {
		return this.getClient().getSessionId();
	}

	public void setUserToken( final String userToken ) {
		this.userToken = userToken;
	}

	public String getName() {
		return name;
	}

	public void setName( final String name ) {
		this.name = name;
	}

	public SocketIOClient getClient() {
		return client;
	}

	public void setClient( final SocketIOClient client ) {
		this.client = client;
	}

	public boolean isConnected() {
		return connected;
	}
}

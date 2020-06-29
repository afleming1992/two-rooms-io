package me.ajfleming.tworoomsio.model;

import java.util.UUID;

import com.corundumstudio.socketio.SocketIOClient;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {
	private String userToken;
	private String name;
	@JsonIgnore
	private String userSecret;
	@JsonIgnore
	private SocketIOClient client;
	@JsonIgnore
	private boolean connected;

	public User( String name, SocketIOClient client) {
		userToken = UUID.randomUUID().toString();
		userSecret = UUID.randomUUID().toString();
		this.name = name;
		this.client = client;
		connected = true;
	}

	public User( String userToken, String userSecret, SocketIOClient client ) {
		this.userToken = userToken;
		this.userSecret = userSecret;
		this.client = client;
	}

	public boolean authenticateUser( String userToken, String userSecret ) {
		return this.userToken.equals( userToken ) && this.userSecret.equals( userSecret );
	}

	public void sendEvent( String eventName, Object payload ) {
		client.sendEvent( eventName, payload );
	}

	public void disconnectPlayer() {
		this.client = null;
		this.connected = false;
	}

	public void reconnectPlayer( SocketIOClient client ) {
		this.client = client;
		this.connected = true;
	}

	public boolean is( User user ) {
		return getUserToken().equals( user.getUserToken() );
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

	public String getUserSecret() {
		return userSecret;
	}
}

package me.ajfleming.tworoomsio.engine;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.corundumstudio.socketio.SocketIOClient;

import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.socket.event.ReloadGameSessionEvent;

public class UserManager {
	/**
	 * Mapped as Key = Socket ID
	 */
	Map<String, User> connectedUsers;
	/**
	 * Mapped as Key = User Token
	 */
	Map<String, User> disconnectedUsers;

	public UserManager() {
		connectedUsers = new HashMap<>();
		disconnectedUsers = new HashMap<>();
	}

	public User createUser( SocketIOClient client, String name ) {
		User user = new User( name, client );
		connectedUsers.put( user.getSocketSessionId().toString(), user );
		return user;
	}

	public Optional<User> getUser( SocketIOClient client ) {
		return Optional.ofNullable( connectedUsers.get( sessionId( client ) ) );
	}

	public Optional<User> reconnectDisconnectedUser( SocketIOClient client,
			ReloadGameSessionEvent event ) {
		User user = disconnectedUsers.get( event.getPlayerToken() );
		if ( user == null ) {
			Optional<User> connectedUserResult = findConnectedUserByPlayerId( event.getPlayerToken() );
			if ( connectedUserResult.isPresent() ) {
				user = connectedUserResult.get();
				user.getClient().disconnect();
			}
		}
		if ( user != null && user.authenticateUser( event.getPlayerToken(),
				event.getPlayerSecret() ) ) {
			user.setClient( client );
			disconnectedUsers.remove( event.getPlayerToken() );
			connectedUsers.put( client.getSessionId().toString(), user );
			return Optional.of( user );
		} else {
			return Optional.empty();
		}
	}

	public Optional<User> handleDisconnectedClient( SocketIOClient client ) {
		User user = connectedUsers.get( sessionId( client ) );
		if ( user != null ) {
			user.disconnectPlayer();
			disconnectedUsers.put( user.getUserToken(), user );
			return Optional.of( user );
		}
		return Optional.empty();
	}

	private Optional<User> findConnectedUserByPlayerId( String playerToken ) {
		return connectedUsers.values().stream().filter( user -> user.getUserToken().equals( playerToken ) ).findFirst();
	}

	private String sessionId( SocketIOClient client ) {
		return client.getSessionId().toString();
	}
}

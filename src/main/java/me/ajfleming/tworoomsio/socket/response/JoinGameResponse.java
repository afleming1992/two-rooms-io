package me.ajfleming.tworoomsio.socket.response;

public class JoinGameResponse {
	private String userToken;

	public JoinGameResponse( String userToken ) {
		this.userToken = userToken;
	}

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken( final String userToken ) {
		this.userToken = userToken;
	}
}

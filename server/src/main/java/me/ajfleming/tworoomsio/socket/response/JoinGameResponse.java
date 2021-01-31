package me.ajfleming.tworoomsio.socket.response;

public class JoinGameResponse {
	private String gameToken;
	private String userToken;
	private String userSecret;

	public JoinGameResponse( String gameToken, String userToken, String userSecret ) {
		this.gameToken = gameToken;
		this.userToken = userToken;
		this.userSecret = userSecret;
	}

	public String getGameToken() {
		return gameToken;
	}

	public void setGameToken( final String gameToken ) {
		this.gameToken = gameToken;
	}

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken( final String userToken ) {
		this.userToken = userToken;
	}

	public String getUserSecret() {
		return userSecret;
	}

	public void setUserSecret( final String userSecret ) {
		this.userSecret = userSecret;
	}
}

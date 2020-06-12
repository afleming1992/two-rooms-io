package me.ajfleming.tworoomsio.socket.event;

public class ReloadGameSessionEvent {
	String gameToken;
	String playerToken;

	public String getGameToken() {
		return gameToken;
	}

	public void setGameToken( final String gameToken ) {
		this.gameToken = gameToken;
	}

	public String getPlayerToken() {
		return playerToken;
	}

	public void setPlayerToken( final String playerToken ) {
		this.playerToken = playerToken;
	}
}

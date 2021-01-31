package me.ajfleming.tworoomsio.socket.event;

public class ReloadGameSessionEvent {

  String gameToken;
  String playerToken;
  String playerSecret;

  public String getGameToken() {
    return gameToken;
  }

  public void setGameToken(final String gameToken) {
    this.gameToken = gameToken;
  }

  public String getPlayerToken() {
    return playerToken;
  }

  public void setPlayerToken(final String playerToken) {
    this.playerToken = playerToken;
  }

  public String getPlayerSecret() {
    return playerSecret;
  }

  public void setPlayerSecret(final String playerSecret) {
    this.playerSecret = playerSecret;
  }
}

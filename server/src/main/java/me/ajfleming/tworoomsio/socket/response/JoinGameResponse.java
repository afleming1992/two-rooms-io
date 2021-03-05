package me.ajfleming.tworoomsio.socket.response;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class JoinGameResponse {

  private String gameToken;
  private String userToken;
  private String userSecret;

  public JoinGameResponse(String gameToken, String userToken, String userSecret) {
    this.gameToken = gameToken;
    this.userToken = userToken;
    this.userSecret = userSecret;
  }
}

package players;

import io.socket.client.Socket;
import java.util.UUID;
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse;

/**
 * Creates a Player which only joins the game;
 */
public class Player {

  private final String prefix = "OnlyConnect_";
  private final String name;
  private Socket socket;
  private JoinGameResponse joinGameResponse;

  public Player() {
    this.name = prefix + UUID.randomUUID().toString();
  }

  public String getName() {
    return name;
  }

  public JoinGameResponse getJoinGameResponse() {
    return joinGameResponse;
  }

  public void setJoinGameResponse(
      JoinGameResponse joinGameResponse) {
    this.joinGameResponse = joinGameResponse;
  }

  public Socket getSocket() {
    return socket;
  }

  public void setSocket(Socket socket) {
    this.socket = socket;
  }
}

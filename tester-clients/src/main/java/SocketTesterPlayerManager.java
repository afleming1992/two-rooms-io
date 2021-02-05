import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.socket.client.IO;
import io.socket.client.IO.Options;
import io.socket.client.Socket;
import io.socket.emitter.Emitter.Listener;
import java.net.URI;
import java.util.List;
import me.ajfleming.tworoomsio.socket.event.JoinGameEvent;
import me.ajfleming.tworoomsio.socket.response.JoinGameResponse;
import org.json.JSONObject;
import players.Player;

public class SocketTesterPlayerManager {

  URI socketServerUri;
  Options socketClientOptions;
  List<Player> players;
  ObjectMapper objectMapper;

  public SocketTesterPlayerManager(URI uri, Options options, List<Player> players) {
    objectMapper = new ObjectMapper();
    socketServerUri = uri;
    socketClientOptions = options;
    this.players = players;
  }

  public void init() {
    for( Player player : players ) {
      System.out.printf("Player %s joining game %n", player.getName());
      Socket socket = createNewSocket();
      setupListeners(socket, player);
      socket.connect();
      joinGame(socket, player);
      player.setSocket(socket);
    }
  }

  private void joinGame(Socket socket, Player player) {
    try {
      socket.emit("JOIN_GAME", objectMapper.writeValueAsString(new JoinGameEvent(player.getName())));
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }
  }

  public void shutdown() {
    for( Player player: players ) {
      if ( player.getSocket() != null ) {
        player.getSocket().disconnect();
        System.out.printf("Player %s disconnected from game %n", player.getName());
      }
    }
  }

  private void setupListeners(Socket socket, Player player) {
    socket.on("JOIN_GAME_SUCCESS", new Listener() {
      @Override
      public void call(Object... objects) {
        JoinGameResponse response = null;
        try {
          response = objectMapper.readValue(objects[0].toString(), JoinGameResponse.class);
        } catch (JsonProcessingException e) {
          e.printStackTrace();
        }
        player.setJoinGameResponse(response);
      }
    });
  }

  private Socket createNewSocket() {
      return IO.socket( socketServerUri, socketClientOptions );
  }
}

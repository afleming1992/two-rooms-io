import io.socket.client.IO;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import players.Player;

public class SocketIOTesterClient {

  public static void main(String [] args) {
    URI uri = URI.create("http://localhost:3001");
    IO.Options options = new IO.Options();
    OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder()
        .connectTimeout(0, TimeUnit.MILLISECONDS)
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .writeTimeout(0, TimeUnit.MILLISECONDS);
    options.callFactory = clientBuilder.build();

    List<Player> players = new ArrayList<>();
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );

    SocketTesterPlayerManager manager = new SocketTesterPlayerManager(uri, options, players);
    manager.init();

    Scanner myObj = new Scanner(System.in);
    boolean loop = true;
    while(loop) {
      System.out.println("ENTER COMMAND:");
      String command = myObj.nextLine();
      String [] commandArray = command.split(" ");
      switch( commandArray[0].toLowerCase(Locale.ROOT) ) {
        case "exit":
          loop = false;
      }
    }
    manager.shutdown();
    System.exit(0);
  }
}

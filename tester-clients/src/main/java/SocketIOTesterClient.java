import io.socket.client.IO;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import players.AlwaysAcceptsSharesPlayer;
import players.AlwaysRejectsSharesPlayer;
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

    String joinCode = askForJoinCode();

    List<Player> players = new ArrayList<>();
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new Player() );
    players.add( new AlwaysAcceptsSharesPlayer() );
    players.add( new AlwaysAcceptsSharesPlayer() );
    players.add( new AlwaysRejectsSharesPlayer() );
    players.add( new AlwaysRejectsSharesPlayer() );

    SocketTesterPlayerManager manager = new SocketTesterPlayerManager(uri, options, players);
    manager.init(joinCode);

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

  private static String askForJoinCode() {
    Scanner myObj = new Scanner(System.in);
    System.out.println("Enter your join code:");
    String[] command = myObj.nextLine().split(" ");
    return command[0].toUpperCase(Locale.ROOT);
  }
}

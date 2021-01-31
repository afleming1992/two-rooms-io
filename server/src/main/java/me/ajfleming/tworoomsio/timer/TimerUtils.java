package me.ajfleming.tworoomsio.timer;

import com.corundumstudio.socketio.SocketIOServer;
import java.util.concurrent.TimeUnit;

public class TimerUtils {

  public static RoundTimer setupTimer(int initialTime, String gameId, SocketIOServer server) {
    return new RoundTimer(initialTime, TimeUnit.SECONDS, onTimerTick(server, gameId),
        onTimerEnd(server, gameId));
  }

  public static TimerTrigger onTimerTick(SocketIOServer server, String gameId) {
    return (timer) -> {
      server.getRoomOperations("game/" + gameId)
          .sendEvent("TIMER_UPDATE", timer);
    };
  }

  public static TimerTrigger onTimerEnd(SocketIOServer server, String gameId) {
    return (timer) -> {
      server.getRoomOperations("game/" + gameId).sendEvent("END_OF_ROUND", timer);
    };
  }
}

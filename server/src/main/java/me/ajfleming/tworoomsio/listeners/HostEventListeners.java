package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.socket.event.GameIdentityPayload;
import me.ajfleming.tworoomsio.socket.event.JoinGameEvent;
import me.ajfleming.tworoomsio.socket.event.RevealPlayerAssignmentEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HostEventListeners extends RequestListener {

  private final UserActionController userActionController;

  @OnEvent("CREATE_GAME")
  public void onStartGame(SocketIOClient client, JoinGameEvent joinGameEvent) {
    userActionController.createGame(client, joinGameEvent.getName());
  }

  @OnEvent("END_ROUND")
  public void onEndRound(SocketIOClient client, GameIdentityPayload game) {
    userActionController.endRound(client, game.getGameId());
  }

  @OnEvent("NEXT_ROUND")
  public void onNextRound(SocketIOClient client, GameIdentityPayload game) {
    userActionController.startNextRound(client, game.getGameId());
  }

  @OnEvent("START_TIMER")
  public void onStartTimer(SocketIOClient client, GameIdentityPayload game) {
    userActionController.startGameTimer(client, game.getGameId());
  }

  @OnEvent("PAUSE_TIMER")
  public void onPauseTimer(SocketIOClient client, GameIdentityPayload game) {
    userActionController.pauseGameTimer(client, game.getGameId());
  }

  @OnEvent("RESTART_TIMER")
  public void onRestartTimer(SocketIOClient client, GameIdentityPayload game) {
    userActionController.restartGameTimer(client, game.getGameId());
  }

  @OnEvent("REVEAL_CARD_ASSIGNMENT")
  public void onRevealCardAssignment(SocketIOClient client, RevealPlayerAssignmentEvent event) {
    userActionController.revealCardAssignment(client, event.getGameId(), event.getCard());
  }
}
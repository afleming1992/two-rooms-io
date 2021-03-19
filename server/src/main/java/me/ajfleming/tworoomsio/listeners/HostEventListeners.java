package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.socket.event.GameIdentityPayload;
import me.ajfleming.tworoomsio.socket.event.RevealPlayerAssignmentEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HostEventListeners extends RequestListener {

  private final UserActionController userActionController;

  @OnEvent("NEXT_ROUND")
  public void onNextRound(SocketIOClient client, GameIdentityPayload gameIdentityPayload) {
    userActionController.startNextRound(client);
  }

  @OnEvent("START_TIMER")
  public void onStartTimer(SocketIOClient client, GameIdentityPayload game) {
    userActionController.startGameTimer(client);
  }

  @OnEvent("PAUSE_TIMER")
  public void onPauseTimer(SocketIOClient client, GameIdentityPayload game) {
    userActionController.pauseGameTimer(client);
  }

  @OnEvent("RESTART_TIMER")
  public void onRestartTimer(SocketIOClient client, GameIdentityPayload game) {
    userActionController.restartGameTimer(client);
  }

  @OnEvent("REVEAL_CARD_ASSIGNMENT")
  public void onRevealCardAssignment(SocketIOClient client, RevealPlayerAssignmentEvent event) {
    userActionController.revealCardAssignment(client, event.getCard());
  }
}
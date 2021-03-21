package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.socket.action.ShareDecisionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CardRequestListeners extends RequestListener {

  private final UserActionController userActionController;

  @OnEvent("REQUEST_SHARE")
  public void onRequestShare(SocketIOClient client, CardShareRequest request) {
    userActionController.requestShare(client, request);
  }

  @OnEvent("ACCEPT_SHARE")
  public void onAcceptShare(SocketIOClient client, ShareDecisionRequest request) {
    userActionController.acceptShare(client, request.getGameId(), request.getRequestId());
  }

  @OnEvent("REJECT_SHARE")
  public void onRejectShare(SocketIOClient client, ShareDecisionRequest request) {
    userActionController.rejectShare(client, request.getGameId(), request.getRequestId());
  }

  @OnEvent("PRIVATE_REVEAL")
  public void onPrivateReveal(SocketIOClient client, CardShareRequest request) {
    userActionController.privateReveal(client, request);
  }
}

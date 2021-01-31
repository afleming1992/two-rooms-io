package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;
import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.socket.action.ShareDecisionRequest;

public class CardRequestListeners {

  private UserActionController userActionController;

  public CardRequestListeners(UserActionController userActionController) {
    this.userActionController = userActionController;
  }

  @OnEvent("REQUEST_SHARE")
  public void onRequestShare(SocketIOClient client, CardShareRequest request) {
    userActionController.requestShare(client, request);
  }

  @OnEvent("ACCEPT_SHARE")
  public void onAcceptShare(SocketIOClient client, ShareDecisionRequest request) {
    userActionController.acceptShare(client, request.getRequestId());
  }

  @OnEvent("REJECT_SHARE")
  public void onRejectShare(SocketIOClient client, ShareDecisionRequest request) {
    userActionController.rejectShare(client, request.getRequestId());
  }

  @OnEvent("PRIVATE_REVEAL")
  public void onPrivateReveal(SocketIOClient client, CardShareRequest request) {
    userActionController.privateReveal(client, request);
  }
}

package players;

import static players.JsonUtils.convertToJsonObject;

import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.socket.action.ShareDecisionRequest;

public class AlwaysAcceptsSharesPlayer extends Player {

  public AlwaysAcceptsSharesPlayer() {
    super("AlwaysAccepts_");
  }

  @Override
  public void onCardShareRequest(CardShareRequest cardShareRequest) {
    ShareDecisionRequest request = new ShareDecisionRequest();
    request.setRequestId(cardShareRequest.getId());
    getSocket().emit("ACCEPT_SHARE", convertToJsonObject( request ));
  }
}

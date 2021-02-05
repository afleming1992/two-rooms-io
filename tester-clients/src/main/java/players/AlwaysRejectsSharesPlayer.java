package players;

import static players.JsonUtils.convertToJsonObject;

import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.socket.action.ShareDecisionRequest;

public class AlwaysRejectsSharesPlayer extends Player {

  public AlwaysRejectsSharesPlayer() {
    super("AlwaysDeclines_");
  }

  @Override
  public void onCardShareRequest(CardShareRequest cardShareRequest) {
    ShareDecisionRequest request = new ShareDecisionRequest();
    request.setRequestId( cardShareRequest.getId() );
    getSocket().emit("REJECT_SHARE", convertToJsonObject( request ));
  }
}

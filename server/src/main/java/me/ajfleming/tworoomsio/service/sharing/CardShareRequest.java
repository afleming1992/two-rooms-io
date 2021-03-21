package me.ajfleming.tworoomsio.service.sharing;

import lombok.Data;

@Data
public class CardShareRequest {
  private String id;
  private String gameId;
  private CardShareType type;
  private String requestor;
  private String recipient;
}

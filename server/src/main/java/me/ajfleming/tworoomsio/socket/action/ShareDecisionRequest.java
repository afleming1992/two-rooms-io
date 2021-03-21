package me.ajfleming.tworoomsio.socket.action;

import lombok.Data;

@Data
public class ShareDecisionRequest {
  String gameId;
  String requestId;
}

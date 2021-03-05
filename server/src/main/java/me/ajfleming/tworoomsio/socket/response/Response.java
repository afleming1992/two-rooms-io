package me.ajfleming.tworoomsio.socket.response;

import lombok.Value;

@Value
public class Response {

  boolean success;
  String message;

  public static Response success(final String message) {
    return new Response(true, message);
  }

  public static Response error(final String message) {
    return new Response(false, message);
  }
}

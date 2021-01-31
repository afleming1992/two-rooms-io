package me.ajfleming.tworoomsio.socket.action;

public enum SocketAction {
  JOIN_GAME("server/JOIN_GAME");

  public String name;

  SocketAction(String name) {
    this.name = name;
  }
}

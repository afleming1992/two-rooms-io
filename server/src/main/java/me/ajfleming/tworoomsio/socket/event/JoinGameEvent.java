package me.ajfleming.tworoomsio.socket.event;

public class JoinGameEvent {

  String name;

  public JoinGameEvent() {}

  public JoinGameEvent( String name ) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }
}

package me.ajfleming.tworoomsio.model.room;

public enum RoomName {
  EAST_WING("EAST_WING"),
  WEST_WING("WEST_WING");

  String name;

  RoomName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}

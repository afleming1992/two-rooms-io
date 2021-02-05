package me.ajfleming.tworoomsio.model;

public enum GameStage {
  CREATED("CREATED"),
  FIRST_ROOM_ALLOCATION("FIRST_ROOM_ALLOCATION"),
  IN_ROUND("IN_ROUND"),
  END_OF_ROUND("END_OF_ROUND"),
  RESULTS("RESULTS");

  String value;

  GameStage(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
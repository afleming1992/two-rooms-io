package me.ajfleming.tworoomsio.model.room;

public enum LeadershipVote {
  YES("Yes"),
  NO("No");

  String value;

  LeadershipVote(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}

package me.ajfleming.tworoomsio.socket.event;

import me.ajfleming.tworoomsio.model.User;

public class LeaderChangeEvent {
  public User newLeader;
  public User nominatedBy;
  public String reason;

  public LeaderChangeEvent() {}

  public LeaderChangeEvent(User newLeader, User nominatedBy, String reason) {
    this.newLeader = newLeader;
    this.nominatedBy = nominatedBy;
    this.reason = reason;
  }

  public User getNewLeader() {
    return newLeader;
  }

  public void setNewLeader(User newLeader) {
    this.newLeader = newLeader;
  }

  public User getNominatedBy() {
    return nominatedBy;
  }

  public void setNominatedBy(User nominatedBy) {
    this.nominatedBy = nominatedBy;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }
}

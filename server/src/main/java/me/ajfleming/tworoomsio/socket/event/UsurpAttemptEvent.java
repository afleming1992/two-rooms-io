package me.ajfleming.tworoomsio.socket.event;

import me.ajfleming.tworoomsio.model.User;

public class UsurpAttemptEvent {

  private String id;
  private User initiator;
  private User nominee;

  public UsurpAttemptEvent(String id, User initiator, User nominee) {
    this.id = id;
    this.initiator = initiator;
    this.nominee = nominee;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public User getInitiator() {
    return initiator;
  }

  public void setInitiator(final User initiator) {
    this.initiator = initiator;
  }

  public User getNominee() {
    return nominee;
  }

  public void setNominee(final User nominee) {
    this.nominee = nominee;
  }
}
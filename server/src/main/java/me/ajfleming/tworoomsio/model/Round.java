package me.ajfleming.tworoomsio.model;

public class Round {

  private int roundNumber;
  private int hostagesRequired;

  public Round(int roundNumber, int hostagesRequired) {
    this.roundNumber = roundNumber;
    this.hostagesRequired = hostagesRequired;
  }

  public int getRoundNumber() {
    return roundNumber;
  }

  public void setRoundNumber(final int roundNumber) {
    this.roundNumber = roundNumber;
  }

  public int getHostagesRequired() {
    return hostagesRequired;
  }

  public void setHostagesRequired(final int hostagesRequired) {
    this.hostagesRequired = hostagesRequired;
  }
}

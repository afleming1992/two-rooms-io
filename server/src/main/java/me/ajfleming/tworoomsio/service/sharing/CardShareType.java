package me.ajfleming.tworoomsio.service.sharing;

public enum CardShareType {
  COLOUR("COLOUR"),
  ROLE("ROLE");

  private String value;

  CardShareType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public void setValue(final String value) {
    this.value = value;
  }
}

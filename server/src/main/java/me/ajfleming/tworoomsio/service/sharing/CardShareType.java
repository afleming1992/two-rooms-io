package me.ajfleming.tworoomsio.service.sharing;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CardShareType {
  COLOUR("COLOUR"),
  ROLE("ROLE");

  private final String value;
}

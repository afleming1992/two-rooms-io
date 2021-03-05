package me.ajfleming.tworoomsio.model;

import lombok.Data;
import lombok.Value;

@Value
public class Round {
  int roundNumber;
  int hostagesRequired;
}

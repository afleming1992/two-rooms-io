package me.ajfleming.tworoomsio.service.lobby;

import java.util.Locale;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;

@Component
public class JoinCodeGenerator {

  public String generateJoinCode() {
    return RandomStringUtils.randomAlphabetic(4).toUpperCase(Locale.ROOT);
  }
}

package me.ajfleming.tworoomsio.controller;

import me.ajfleming.tworoomsio.engine.GameEngine;
import me.ajfleming.tworoomsio.engine.UserManager;

public class AdminActionController {
  private final GameEngine gameEngine;
  private final UserManager userManager;

  public AdminActionController(GameEngine gameEngine, UserManager userManager) {
    this.gameEngine = gameEngine;
    this.userManager = userManager;
  }


}

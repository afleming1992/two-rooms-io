package me.ajfleming.tworoomsio.engine;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;

/**
 * Responsible for taking effects triggered by users and applying them to the Game
 */
public interface GameEngine {

  Game createNewGame(User hostUser) throws GameException;

  String addPlayerToGame(User user) throws GameException;

  void reloadPlayerIntoGame(String gameToken, User user) throws GameException;

  void disconnectPlayer(User user);

  void nextRound(User requestor) throws GameException;

  void startTimer(User requestor) throws GameException;

  void pauseTimer(User requestor) throws GameException;

  void restartTimer(User requestor) throws GameException;

  CardShareRequest requestShare(User requestor, CardShareRequest request) throws GameException;

  void privateReveal(User requestor, CardShareRequest request) throws GameException;

  void acceptShare(User user, String requestId) throws GameException;

  void rejectShare(User user, String requestId) throws GameException;

  void revealCardAssignment(User user, CardKey card) throws GameException;
}


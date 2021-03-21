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

  void joinGame(Game game, User player) throws GameException;

  void reloadPlayerIntoGame(Game game, User player) throws GameException;

  void disconnectPlayer(User player);

  void nextRound(Game game, User requestor) throws GameException;

  void startTimer(Game game, User requestor) throws GameException;

  void pauseTimer(Game game, User requestor) throws GameException;

  void restartTimer(Game game, User requestor) throws GameException;

  CardShareRequest requestShare(Game game, User requestor, CardShareRequest request) throws GameException;

  void privateReveal(Game game, User requestor, CardShareRequest request) throws GameException;

  void acceptShare(Game game, User user, String requestId) throws GameException;

  void rejectShare(Game game, User user, String requestId) throws GameException;

  void revealCardAssignment(Game game, User user, CardKey card) throws GameException;
}


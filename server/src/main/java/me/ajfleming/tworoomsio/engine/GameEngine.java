package me.ajfleming.tworoomsio.engine;

import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.CardKey;
import me.ajfleming.tworoomsio.model.Game;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;

/**
 * Responsible for taking effects triggered by users and applying them to the Game
 */
public interface GameEngine {

  Game createNewGame(User hostUser) throws GameException;

  void joinGame(Game game, User player) throws GameException;

  void reloadPlayerIntoGame(Game game, User player) throws GameException;

  void disconnectPlayer(User player);

  // Host Operations

  void startGame(Game game, User user) throws GameException;

  void endRound(Game game, User user) throws GameException;

  void nextRound(Game game, User requestor) throws GameException;

  void startTimer(Game game, User requestor) throws GameException;

  void pauseTimer(Game game, User requestor) throws GameException;

  void restartTimer(Game game, User requestor) throws GameException;

  // Card Sharing Operations

  CardShareRequest requestShare(Game game, User requestor, CardShareRequest request) throws GameException;

  void privateReveal(Game game, User requestor, CardShareRequest request) throws GameException;

  void acceptShare(Game game, User user, String requestId) throws GameException;

  void rejectShare(Game game, User user, String requestId) throws GameException;

  void revealCardAssignment(Game game, User user, CardKey card) throws GameException;

  // Room Operations

  void nominateLeader(Game game, RoomName room, User nominator, User nominee) throws GameException;

  void nominateHostage(Game game, RoomName room, User leader, User hostage) throws GameException;

  void performHostageSwitch(Game game, User host) throws GameException;

  void abdicateAsLeader(Game game, RoomName room, User leader, User replacement) throws GameException;

  void acceptLeadership(Game game, RoomName room, User newLeader) throws GameException;

  void declineLeadership(Game game, RoomName room, User decliner) throws GameException;

  void beginUsurp(Game game, RoomName room, User usurper, User leadershipNominee) throws GameException;

  void leadershipVote(Game game, RoomName room, User voter, LeadershipVote vote) throws GameException;

  void resolveLeadershipVote(Game game, RoomName roomName, LeadershipVote agreed);
}

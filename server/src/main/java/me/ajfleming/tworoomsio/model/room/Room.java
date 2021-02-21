package me.ajfleming.tworoomsio.model.room;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.User;
import me.ajfleming.tworoomsio.model.UsurpAttempt;
import me.ajfleming.tworoomsio.socket.event.JoinRoomEvent;

public class Room {

  ReentrantLock firstLeaderLock = new ReentrantLock(true);
  private RoomName roomName;
  private List<User> players;
  private User leader;
  @JsonIgnore
  private String channelName;
  private LinkedList<User> hostages;
  private User replacementLeader;
  private UsurpAttempt usurpAttempt;

  public void newRound() {
    this.hostages = new LinkedList<>();
  }

  public void addPlayer(User user, String reasonForJoin) {
    if (this.players == null) {
      this.players = new ArrayList<>();
    }

    user.joinSocketRoom(channelName);
    user.sendEvent("JOIN_ROOM", new JoinRoomEvent(this.roomName, reasonForJoin));

    this.players.add(user);
  }

  public void addPlayers(List<User> users, String reasonForJoin) {
    if (this.players == null) {
      this.players = new ArrayList<>();
    }

    for (User user : users) {
      user.joinSocketRoom(channelName);
      user.sendEvent("JOIN_ROOM", new JoinRoomEvent(this.roomName, reasonForJoin));
      this.players.add(user);
    }
  }

  public void removePlayer(String token) {
    Optional<User> player = this.players.stream()
        .filter(user -> user.getUserToken().equals(token))
        .findFirst();

    if (player.isPresent()) {
      this.players = this.players.stream()
          .filter(user -> !user.getUserToken().equals(token))
          .collect(Collectors.toList());
      player.get().leaveSocketRoom(channelName);
    }
  }

  public List<User> removeHostages() {
    for (User hostage : hostages) {
      removePlayer(hostage.getUserToken());
    }

    return hostages;
  }

  public void deselectHostage(User deselectedHostage) {
    this.hostages = this.hostages.stream().filter(hostage -> !hostage.is(deselectedHostage)).collect(Collectors.toCollection(LinkedList::new));
  }

  public boolean isPlayerInRoom(User player) {
    return players.stream().anyMatch(user -> player.getUserToken().equals(user.getUserToken()));
  }

  public void setFirstLeader(User leader) throws GameException {
    firstLeaderLock.lock();
    try {
      if (leader != null) {
        this.leader = leader;
      } else {
        throw new GameException("Leader has already been assigned");
      }
    } finally {
      firstLeaderLock.unlock();
    }
  }

  public void nominateHostage(User newHostage, int maxHostages) throws GameException {
    if (isPlayerACurrentHostage(newHostage)) {
      throw new GameException(newHostage.getName() + "is already a hostage");
    }

    hostages.add(newHostage);
    if (hostages.size() > maxHostages) {
      hostages.pollFirst();
    }
  }

  public int getHostageCount() {
    if (hostages != null) {
      return hostages.size();
    } else {
      return 0;
    }
  }

  private boolean isPlayerACurrentHostage(User player) {
    return hostages.stream()
        .anyMatch(hostage -> player.getUserToken().equals(hostage.getUserToken()));
  }

  public UsurpAttempt getUsurpAttempt() {
    return usurpAttempt;
  }

  public void setUsurpAttempt(final UsurpAttempt usurpAttempt) {
    this.usurpAttempt = usurpAttempt;
  }

  public String getChannelName() {
    return channelName;
  }

  public void setChannelName(String gameId) {
    channelName = "game/" + gameId + "/room/" + roomName;
  }

  public RoomName getRoomName() {
    return roomName;
  }

  public void setRoomName(final RoomName roomName) {
    this.roomName = roomName;
  }

  public List<User> getPlayers() {
    return players;
  }

  public void setPlayers(final List<User> players) {
    this.players = players;
  }

  public User getLeader() {
    return leader;
  }

  public void setLeader(final User leader) {
    this.leader = leader;
    if(isPlayerACurrentHostage(leader)){
      deselectHostage(leader);
    }
  }

  public boolean isPlayerLeader(final User leader) {
    return this.leader.getUserToken().equals(leader.getUserToken());
  }

  public List<User> getHostages() {
    return this.hostages;
  }

  public User getReplacementLeader() {
    return this.replacementLeader;
  }

  public void setReplacementLeader(final User replacement) {
    this.replacementLeader = replacement;
  }
}
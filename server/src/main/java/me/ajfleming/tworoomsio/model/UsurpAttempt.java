package me.ajfleming.tworoomsio.model;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import me.ajfleming.tworoomsio.actions.PostRoomVoteAction;
import me.ajfleming.tworoomsio.exception.GameException;
import me.ajfleming.tworoomsio.model.room.LeadershipVote;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.socket.event.UsurpAttemptEvent;

public class UsurpAttempt {

  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
  String id;
  RoomName roomName;
  User initiator;
  User nominee;
  List<User> validVoters;
  PostRoomVoteAction postRoomVoteAction;
  long majority;
  Map<String, LeadershipVote> votes;
  private int secondsLeft;
  private ScheduledFuture<?> refreshTask;

  public UsurpAttempt(RoomName roomName, User initiator, User nominee, List<User> validVoters,
      PostRoomVoteAction postRoomVoteAction) {
    this.id = UUID.randomUUID().toString();
    this.initiator = initiator;
    this.nominee = nominee;
    this.validVoters = validVoters;
    this.postRoomVoteAction = postRoomVoteAction;
  }

  public void initiateUsurpVote() {
    this.majority = calculateMajority();
    this.secondsLeft = 15;
    timerStart();
  }

  private long calculateMajority() {
    return (validVoters.size()) / 2 + 1;
  }

  public void registerVote(User voter, LeadershipVote vote) throws GameException {
    if (isValidVoter(voter) && secondsLeft > 0) {
      votes.put(voter.getUserToken(), vote);
    } else {
      throw new GameException("You are not eligible to vote in this vote");
    }
  }

  private boolean isValidVoter(User voter) {
    return validVoters.stream().anyMatch(user -> user.is(voter));
  }

  public void resolveVote() {
    long totalUsurpVotes = votes.values().stream().filter(vote -> vote == LeadershipVote.YES)
        .count();
    if (totalUsurpVotes >= majority) {
      postRoomVoteAction.success(this.roomName);
    } else {
      postRoomVoteAction.failure(this.roomName);
    }
  }

  private void timerStart() {
    final Runnable refresh = () -> {
      secondsLeft--;
      if (secondsLeft < 1) {
        resolveVote();
        refreshTask.cancel(true);
      }
    };
    refreshTask = scheduler.scheduleAtFixedRate(refresh, 0, 1, TimeUnit.SECONDS);
  }

  private void stopTimer() {
    if (refreshTask != null) {
      refreshTask.cancel(true);
    }
  }

  public UsurpAttemptEvent getEvent() {
    return new UsurpAttemptEvent(this.getId(), this.getInitiator(), this.getNominee());
  }

  public User getNominee() {
    return nominee;
  }

  public void setNominee(final User nominee) {
    this.nominee = nominee;
  }

  public User getInitiator() {
    return initiator;
  }

  public void setInitiator(final User initiator) {
    this.initiator = initiator;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
}
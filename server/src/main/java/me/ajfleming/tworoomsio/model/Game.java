package me.ajfleming.tworoomsio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.ajfleming.tworoomsio.model.room.Room;
import me.ajfleming.tworoomsio.model.room.RoomName;
import me.ajfleming.tworoomsio.service.sharing.CardShareRequest;
import me.ajfleming.tworoomsio.timer.RoundTimer;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Game {
  private String id;
  private String joinCode;
  private User host;
  private GameStage stage;
  private int round;
  private int numberOfRounds;
  private List<User> players;
  private List<Card> deck;
  @JsonIgnore
  private Map<String, Card> cardAssignments;
  private List<CardAssignment> revealedCardAssignments;
  @JsonIgnore
  private Map<String, CardShareRequest> cardShareRequests;
  private RoundTimer timer;
  private List<Round> roundData;
  private Map<RoomName, Room> rooms;

  public void addPlayer(User user) {
    if( players == null ) {
      players = new ArrayList<>();
    }
    this.players.add(user);
  }

  public boolean reconnectPlayer(User reconnectingUser) {
    AtomicBoolean reconnected = new AtomicBoolean(false);

    this.players.stream().filter(user -> user.is(reconnectingUser)).forEach(user -> {
      user.reconnectPlayer(reconnectingUser.getClient());
      reconnected.set(true);
      reconnected.set(true);
    });

    return reconnected.get();
  }

  public void removePlayer(User playerToRemove) {
    this.players = this.players.stream()
        .filter(user -> user.is(playerToRemove))
        .collect(Collectors.toList());
  }

  public void addShareRequest(final CardShareRequest request) {
    cardShareRequests.put(request.getId(), request);
  }

  public Optional<CardShareRequest> getCardShareRequest(final String requestId) {
    return Optional.ofNullable(cardShareRequests.get(requestId));
  }

  public void invalidateCardShareRequest(final String requestId) {
    cardShareRequests.remove(requestId);
  }

  public Optional<User> findPlayer(String name) {
    return players.stream().filter(user -> user.getName().equals(name)).findFirst();
  }

  public Optional<User> findPlayerByUserToken(String token) {
    return players.stream().filter(user -> user.getUserToken().equals(token)).findFirst();
  }

  public void disconnectPlayer(final String userToken) {
    Optional<User> search = findPlayerByUserToken(userToken);
    if (search.isPresent()) {
      if (hasStarted() || isUserHost(search.get())) {
        // Soft Disconnect the User (Mark as Disconnected)
        this.players.forEach(user -> {
          if (user.getUserToken().equals(userToken)) {
            user.disconnectPlayer();
          }
        });
      } else {
        // Hard Disconnect the user (Remove them completely)
        this.players = this.players.stream()
            .filter(user -> !user.getUserToken().equals(userToken))
            .collect(Collectors.toList());
      }
    }
  }

  public boolean hasStarted() {
    return round > 0;
  }

  public Optional<Card> getRoleAssignmentForUser(final String userToken) {
    Card card = cardAssignments.get(userToken);
    if (card != null) {
      return Optional.of(card);
    } else {
      return Optional.empty();
    }
  }

  public List<User> getUserAssignmentForCard(final CardKey card) {
    List<String> userTokens = cardAssignments.entrySet()
        .stream()
        .filter(entry -> entry.getValue().getKey() == card)
        .map(entry -> entry.getKey())
        .collect(Collectors.toList());

    return players.stream()
        .filter(user -> userTokens.contains(user.getUserToken()))
        .collect(Collectors.toList());
  }

  public void permanentRevealUserCard(final User player) {
    if (!isUserAlreadyRevealed(player)) {
      Card card = cardAssignments.get(player.getUserToken());
      revealedCardAssignments.add(new CardAssignment(player.getUserToken(), card));
    }
  }

  public boolean isUserAlreadyRevealed(final User player) {
    return revealedCardAssignments.stream()
        .anyMatch(cardAssignment -> cardAssignment.getPlayer().equals(player.getUserToken()));
  }

  public boolean isUserHost(final User user) {
    return host.getUserToken().equals(user.getUserToken());
  }

  public void nextRound() {
    round++;
    stage = GameStage.IN_ROUND;
  }

  public void resetCardShares() {
    this.cardShareRequests = new HashMap<>();
  }

  public int getTotalPlayerCount() {
    return this.players.size();
  }

  public Room getRoom(RoomName roomName) {
    return rooms.get(roomName);
  }

  @JsonIgnore
  public int getMaxHostages() {
    if ( roundData != null ) {
      return getRoundData().get( round - 1 ).getHostagesRequired();
    } else {
      return 0;
    }
  }

  public Optional<Room> findRoomUserIsIn( final User user ) {
    return rooms.values().stream().filter( room -> room.isPlayerInRoom( user )).findFirst();
  }

  public static class GameBuilder {
    public GameBuilder newGame(User host, String joinCode) {
      this.id = UUID.randomUUID().toString();
      this.host = host;
      this.round = 0;
      this.players = new ArrayList<>();
      this.deck = new ArrayList<>();
      this.cardShareRequests = new HashMap<>();
      this.revealedCardAssignments = new ArrayList<>();
      this.numberOfRounds = 3;
      this.joinCode = joinCode;
      this.stage = GameStage.CREATED;
      return this;
    }
  }
}
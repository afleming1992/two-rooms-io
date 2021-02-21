package me.ajfleming.tworoomsio.socket.event;

import java.util.List;
import me.ajfleming.tworoomsio.model.User;

public class HostageChangeEvent {
  private List<User> hostages;

  public HostageChangeEvent(List<User> hostages) {
    this.hostages = hostages;
  }

  public List<User> getHostages() {
    return hostages;
  }
}

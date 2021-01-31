package me.ajfleming.tworoomsio.timer;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class RoundTimer {

  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
  private long initialUnits;
  private boolean timerRunning;
  private long unitsLeft;
  private TimeUnit unitType;
  private TimerTrigger onTick;
  private TimerTrigger onEnd;
  private ScheduledFuture<?> refreshTask;

  public RoundTimer(int unitsLeft, TimeUnit unitType, TimerTrigger onTick, TimerTrigger onEnd) {
    this.timerRunning = false;
    this.initialUnits = unitsLeft;
    this.unitsLeft = unitsLeft;
    this.unitType = unitType;
    this.onTick = onTick;
    this.onEnd = onEnd;
  }

  public void start() {
    if (unitsLeft > 0) {
      timerRunning = true;
      if (refreshTask == null) {
        final Runnable refresh = () -> {
          unitsLeft--;
          onTick.trigger(this);
          if (unitsLeft < 1) {
            onEnd.trigger(this);
            refreshTask.cancel(true);
          }
        };
        refreshTask = scheduler.scheduleAtFixedRate(refresh, 0, 1, unitType);
      }
    }
  }

  public void stop() {
    if (refreshTask != null) {
      refreshTask.cancel(true);
      timerRunning = false;
      onTick.trigger(this);
      refreshTask = null;
    }
  }

  public boolean isTimerRunning() {
    return timerRunning;
  }

  public long getUnitsLeft() {
    return unitsLeft;
  }

  public long getInitialUnits() {
    return initialUnits;
  }
}

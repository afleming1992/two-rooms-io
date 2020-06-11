package me.ajfleming.tworoomsio.timer;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class RoundTimer {

	private boolean timerRunning;
	private long unitsLeft;
	private TimeUnit unitType;
	private TimerTrigger onTick;
	private TimerTrigger onEnd;

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private ScheduledFuture<?> refreshTask;

	public RoundTimer( int unitsLeft, TimeUnit unitType, TimerTrigger onTick, TimerTrigger onEnd ) {
		this.timerRunning = false;
		this.unitsLeft = unitsLeft;
		this.unitType = unitType;
		this.onTick = onTick;
		this.onEnd = onEnd;
	}

	public void start() {
		timerRunning = true;
		if ( refreshTask == null ) {
			final Runnable refresh = () -> {
				unitsLeft--;
				if( unitsLeft < 1 ) {
					onEnd.trigger( unitsLeft );
					refreshTask.cancel( true );
				} else {
					onTick.trigger( unitsLeft );
				}
			};
			refreshTask = scheduler.scheduleAtFixedRate( refresh, 0, 1, unitType );
		}
	}

	public void stop() {
		if ( refreshTask != null ) {
			refreshTask.cancel( true );
			timerRunning = false;
			onTick.trigger( unitsLeft );
		}
	}

	public boolean getTimerRunning() {
		return timerRunning;
	}

	public long getUnitsLeft() {
		return unitsLeft;
	}
}

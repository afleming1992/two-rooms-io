package me.ajfleming.tworoomsio.timer;

import static java.lang.Thread.sleep;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoundTimerTest {

	@Test
	@DisplayName("start: Should run a timer which lasts for 10 seconds and stop on zero")
	void start_shouldTickAndEnd_when_timerIsRunToEnd() throws InterruptedException {
		// Given
		final AtomicInteger totalTicks = new AtomicInteger( 0 );
		final AtomicBoolean onEndTriggered = new AtomicBoolean( false );

		TimerTrigger onTick = ( unitsleft ) -> totalTicks.getAndIncrement();
		TimerTrigger onEnd = ( unitsLeft ) -> onEndTriggered.set( true );

		RoundTimer timer = new RoundTimer(10, TimeUnit.MILLISECONDS, onTick, onEnd );

		// When
		timer.start();

		// Then
		sleep( 10 );

		assertThat( totalTicks.get(), equalTo( 10 ) );
		assertThat( onEndTriggered.get(), equalTo( true ) );
	}

	@Test
	@DisplayName("stop: Should stop timer properly when timer is stopped whilst running")
	void stop_shouldStopTimer_when_timerIsStoppedWhilstRunning() throws InterruptedException {
		// Given
		final AtomicInteger totalTicks = new AtomicInteger( 0 );
		final AtomicBoolean onEndTriggered = new AtomicBoolean( false );

		TimerTrigger onTick = ( unitsLeft ) -> totalTicks.getAndIncrement();
		TimerTrigger onEnd = ( unitsLeft ) -> onEndTriggered.set( true );

		RoundTimer timer = new RoundTimer( 3, TimeUnit.SECONDS, onTick, onEnd );

		// When
		timer.start();
		sleep(100);
		timer.stop();

		// Then
		assertThat( totalTicks.get(), equalTo( 2 ) );
		assertThat( timer.getUnitsLeft(), equalTo( 2L ) );
		assertThat( onEndTriggered.get(), equalTo( false ) );
	}
}
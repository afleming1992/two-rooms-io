package me.ajfleming.tworoomsio.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.GameController;

public class HostEventListeners {

	private GameController gameController;

	public HostEventListeners( GameController gameController ) {
		this.gameController = gameController;
	}

	@OnEvent("NEXT_ROUND")
	public void onNextRound(SocketIOClient client) {
		gameController.startNextRound( client );
	}

	@OnEvent("START_TIMER")
	public void onStartTimer(SocketIOClient client) {
		gameController.startGameTimer();
	}

	@OnEvent("PAUSE_TIMER")
	public void onPauseTimer(SocketIOClient client) {
		gameController.pauseGameTimer();
	}
}

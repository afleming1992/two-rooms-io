package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.UserActionController;

public class HostEventListeners {

	private UserActionController userActionController;

	public HostEventListeners( UserActionController userActionController ) {
		this.userActionController = userActionController;
	}

	@OnEvent("NEXT_ROUND")
	public void onNextRound(SocketIOClient client) {
		userActionController.startNextRound( client );
	}

	@OnEvent("START_TIMER")
	public void onStartTimer(SocketIOClient client) {
		userActionController.startGameTimer( client );
	}

	@OnEvent("PAUSE_TIMER")
	public void onPauseTimer(SocketIOClient client) {
		userActionController.pauseGameTimer( client );
	}

	@OnEvent("RESTART_TIMER")
	public void onRestartTimer(SocketIOClient client) { userActionController.restartGameTimer( client ); }
}
package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.UserActionController;
import me.ajfleming.tworoomsio.socket.event.RevealPlayerAssignmentEvent;

public class HostEventListeners {

	private final UserActionController userActionController;

	public HostEventListeners( UserActionController userActionController ) {
		this.userActionController = userActionController;
	}

	@OnEvent("START_GAME")
	public void onStartGame(SocketIOClient client) { userActionController.startGame(client); }

	@OnEvent("END_ROUND")
	public void onEndRound(SocketIOClient client) { userActionController.endRound(client); }

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

	@OnEvent("REVEAL_CARD_ASSIGNMENT")
	public void onRevealCardAssignment(SocketIOClient client, RevealPlayerAssignmentEvent event ) {
		userActionController.revealCardAssignment( client, event.getCard() );
	}
}
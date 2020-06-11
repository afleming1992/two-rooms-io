package me.ajfleming.tworoomsio.listeners;

import com.corundumstudio.socketio.annotation.OnEvent;

import me.ajfleming.tworoomsio.controller.GameController;

public class RoomEventListeners {
	private GameController gameController;

	public RoomEventListeners( GameController gameController ) {
		this.gameController = gameController;
	}
}

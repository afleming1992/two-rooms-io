package me.ajfleming.tworoomsio;

import com.corundumstudio.socketio.SocketIOServer;

public class ServerRunnable extends Thread {

	static volatile boolean keepRunning = true;

	private SocketIOServer server;

	public ServerRunnable( SocketIOServer server ) {
		this.server = server;
	}

	public void run() {
		server.start();
		while( keepRunning ) {
			try {
				sleep(1000);
			} catch ( InterruptedException e ) {

			}
		}
		server.stop();
	}

	public void stopServer() {
		keepRunning = false;
	}
}

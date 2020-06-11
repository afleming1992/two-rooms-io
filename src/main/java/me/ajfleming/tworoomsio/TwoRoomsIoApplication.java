package me.ajfleming.tworoomsio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.controller.GameController;
import me.ajfleming.tworoomsio.listeners.HostEventListeners;
import me.ajfleming.tworoomsio.listeners.PlayerEventListeners;

@SpringBootApplication
public class TwoRoomsIoApplication {

	private static final Logger LOGGER = LoggerFactory.getLogger( TwoRoomsIoApplication.class );

	public static void main( String[] args ) {
		Configuration config = new Configuration();
		config.setHostname( "localhost" );
		config.setPort( 3000 );

		final SocketIOServer server = new SocketIOServer( config );
		final GameController gameController = new GameController( server );
		final HostEventListeners hostListeners = new HostEventListeners( gameController );
		final PlayerEventListeners playerListeners = new PlayerEventListeners( gameController );

		server.addListeners( hostListeners );
		server.addListeners( playerListeners );

		ServerRunnable runnable = new ServerRunnable( server );
		try {
			runnable.start();
			Runtime.getRuntime().addShutdownHook( new Thread( () -> {
				runnable.stopServer();
				runnable.interrupt();
				try {
					runnable.join();
				} catch (InterruptedException e) {

				}
			} ) );
		} catch ( Exception e ) {
			LOGGER.error( "Exception caught. Beginning Shutdown Procedure of Server", e );
			runnable.stopServer();
		}
	}
}

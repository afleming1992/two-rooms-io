package me.ajfleming.tworoomsio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketConfig;
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
		config.setPort( 3001 );

		SocketConfig socketConfig = new SocketConfig();
		socketConfig.setReuseAddress( true );
		config.setSocketConfig( socketConfig );

		final SocketIOServer server = new SocketIOServer( config );
		final GameController gameController = new GameController( server );
		final PlayerEventListeners playerEventListeners = new PlayerEventListeners( gameController );
		final HostEventListeners hostEventListeners = new HostEventListeners( gameController );

		server.addListeners( playerEventListeners );
		server.addListeners( hostEventListeners );

		server.start();
	}
}

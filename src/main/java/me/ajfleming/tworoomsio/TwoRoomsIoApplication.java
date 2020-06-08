package me.ajfleming.tworoomsio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;

import me.ajfleming.tworoomsio.controller.GameController;
import me.ajfleming.tworoomsio.service.SocketBroadcastService;
import me.ajfleming.tworoomsio.service.SocketEventListenerService;

@SpringBootApplication
public class TwoRoomsIoApplication {

	public static void main( String[] args ) {
		SpringApplication.run( TwoRoomsIoApplication.class, args );

		Configuration config = new Configuration();
		config.setHostname( "localhost" );
		config.setPort( 3000 );

		final SocketIOServer server = new SocketIOServer( config );
		final GameController gameController = new GameController( server );
		final SocketEventListenerService gameService = new SocketEventListenerService( gameController );

		server.addListeners( gameService );

		server.start();
	}
}

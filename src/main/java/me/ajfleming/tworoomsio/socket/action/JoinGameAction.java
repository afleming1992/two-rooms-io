package me.ajfleming.tworoomsio.socket.action;

public class JoinGameAction extends SocketActionEvent {
	private String name;

	public JoinGameAction( String name ) {
		super( SocketAction.JOIN_GAME );
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName( final String name ) {
		this.name = name;
	}
}

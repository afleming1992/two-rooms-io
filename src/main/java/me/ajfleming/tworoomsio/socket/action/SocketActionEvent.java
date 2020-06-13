package me.ajfleming.tworoomsio.socket.action;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import me.ajfleming.tworoomsio.socket.event.JoinGameEvent;

@JsonTypeInfo(
		use = JsonTypeInfo.Id.NAME,
		include = JsonTypeInfo.As.PROPERTY,
		property = "type"
)
@JsonSubTypes({
	@JsonSubTypes.Type(value = JoinGameEvent.class, name = "server/JOIN_GAME")
})
public abstract class SocketActionEvent {
	public SocketAction type;

	public SocketActionEvent( SocketAction type ) {
		this.type = type;
	}

	public void setType( final SocketAction type ) {
		this.type = type;
	}

	public SocketAction getType() {
		return type;
	}
}

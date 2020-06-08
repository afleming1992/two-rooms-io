package me.ajfleming.tworoomsio.socket.response;

public class Response {
	boolean success;
	String message;

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess( final boolean success ) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage( final String message ) {
		this.message = message;
	}

	public static Response success( final String message ) {
		Response response = new Response();
		response.setSuccess( true );
		response.setMessage( message );
		return response;
	}

	public static Response error( final String message ) {
		Response response = new Response();
		response.setSuccess( false );
		response.setMessage( message );
		return response;
	}
}

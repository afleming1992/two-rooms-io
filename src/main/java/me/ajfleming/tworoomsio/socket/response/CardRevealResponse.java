package me.ajfleming.tworoomsio.socket.response;

import me.ajfleming.tworoomsio.model.Card;
import me.ajfleming.tworoomsio.model.Team;

public class CardRevealResponse {
	public boolean isReveal;
	public String requestId;
	public String userToken;
	public Team team;
	public Card role;

	public static CardRevealResponse roleShare( String requestId, String userToken, Card role ) {
		CardRevealResponse response = new CardRevealResponse();
		response.setRequestId( requestId );
		response.setReveal( false );
		response.setUserToken( userToken );
		response.setRole( role );
		return response;
	}

	public static CardRevealResponse roleReveal( String userToken, Card role ) {
		CardRevealResponse response = new CardRevealResponse();
		response.setReveal( true );
		response.setUserToken( userToken );
		response.setRole( role );
		return response;
	}

	public static CardRevealResponse colourShare( String requestId, String userToken, Card card ) {
		CardRevealResponse response = new CardRevealResponse();
		response.setRequestId( requestId );
		response.setReveal( false );
		response.setUserToken( userToken );
		response.setTeam( card.getTeam() );
		return response;
	}

	public static CardRevealResponse colourReveal( String userToken, Card card ) {
		CardRevealResponse response = new CardRevealResponse();
		response.setReveal( true );
		response.setUserToken( userToken );
		response.setTeam( card.getTeam() );
		return response;
	}

	public boolean isReveal() {
		return isReveal;
	}

	public void setReveal( final boolean reveal ) {
		isReveal = reveal;
	}

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken( final String userToken ) {
		this.userToken = userToken;
	}

	public Team getTeam() {
		return team;
	}

	public void setTeam( final Team team ) {
		this.team = team;
	}

	public Card getRole() {
		return role;
	}

	public void setRole( final Card role ) {
		this.role = role;
	}

	public String getRequestId() {
		return requestId;
	}

	public void setRequestId( final String requestId ) {
		this.requestId = requestId;
	}
}

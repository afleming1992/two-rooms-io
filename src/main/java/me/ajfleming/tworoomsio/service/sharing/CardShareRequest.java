package me.ajfleming.tworoomsio.service.sharing;

public class CardShareRequest {
	private String id;
	private CardShareType type;
	private String requestor;
	private String recipient;

	public String getId() {
		return id;
	}

	public void setId( final String id ) {
		this.id = id;
	}

	public CardShareType getType() {
		return type;
	}

	public void setType( final CardShareType type ) {
		this.type = type;
	}

	public String getRequestor() {
		return requestor;
	}

	public void setRequestor( final String requestor ) {
		this.requestor = requestor;
	}

	public String getRecipient() {
		return recipient;
	}

	public void setRecipient( final String recipient ) {
		this.recipient = recipient;
	}
}

package me.ajfleming.tworoomsio.socket.event;


public enum ServerEvents {
	CLEAR_EVENTS,
	NEW_LEADER,
	HOSTAGE_UPDATE,
	SHOW_HOSTAGES,
	ROOM_LEADER_OFFER,
	LEADER_UPDATE,
	ABDICATE_DECLINED,
	USURP_ATTEMPT,
	USURP_ATTEMPT_SUCCESSFUL,
	USURP_ATTEPT_FAILED,
	SHARE_REQUEST_RECEIVED,
	PRIVATE_REVEAL_RECEIVED,
	CARD_SHARE_ACCEPTED,
	GAME_UPDATE,
	CARD_UPDATE
}

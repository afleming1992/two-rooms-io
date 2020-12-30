import {Action} from "redux";

export enum Actions {
    CONNECTED="CONNECTED",
    DISCONNECTED="DISCONNECTED",
    JOIN_GAME = "JOIN_GAME",
    RELOAD_GAME_SESSION = "RELOAD_GAME_SESSION",
    HIDE_ERROR = "HIDE_ERROR",
    NEXT_ROUND = "NEXT_ROUND",
    START_TIMER = "START_TIMER",
    PAUSE_TIMER = "PAUSE_TIMER",
    RESTART_TIMER = "RESTART_TIMER",
    REQUEST_SHARE = "REQUEST_SHARE",
    ACCEPT_SHARE = "ACCEPT_SHARE",
    REJECT_SHARE = "REJECT_SHARE",
    PRIVATE_REVEAL = "PRIVATE_REVEAL",
    DISMISS_EVENT = "DISMISS_EVENT",
    REVEAL_CARD_ASSIGNMENT = "REVEAL_CARD_ASSIGNMENT",
    OTHER_ACTION = "__any_other_action_type__",
}

export enum RevealActions {
    DO_REVEAL = "DO_REVEAL",
    CLEAR_REVEAL = "CLEAR_REVEAL"
}

export interface SocketAction extends Action {
    type: Actions,
    meta: {
        remote: boolean
    },
    payload: Object
}
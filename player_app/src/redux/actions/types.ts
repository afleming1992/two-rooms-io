import {Action} from "redux";

export enum ActionModalActions {
    OPEN_SHARE_MODAL="OPEN_SHARE_MODAL",
    CLOSE_MODAL="CLOSE_MODAL",
    OPEN_REVEAL_MODAL="OPEN_REVEAL_MODAL",
}

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
    RESPOND_TO_EVENT = "RESPOND_TO_EVENT",
    DISMISS_EVENT = "DISMISS_EVENT",
    REVEAL_CARD_ASSIGNMENT = "REVEAL_CARD_ASSIGNMENT",
    OTHER_ACTION = "__any_other_action_type__",
}

export enum RevealActions {
    DO_REVEAL = "DO_REVEAL",
    CLEAR_REVEAL = "CLEAR_REVEAL"
}

export enum NotificationActions {
    CLOSE_SNACKBAR = "CLOSE_SNACKBAR",
    REMOVE_SNACKBAR = "REMOVE_SNACKBAR"
}

export interface SocketAction extends Action {
    type: Actions,
    meta: {
        remote: boolean
    },
    payload: Object
}
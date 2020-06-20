export enum Actions {
    CONNECTED="CONNECTED",
    DISCONNECTED="DISCONNECTED",
    JOIN_GAME = "JOIN_GAME",
    HIDE_ERROR = "HIDE_ERROR",
    NEXT_ROUND = "NEXT_ROUND",
    START_TIMER = "START_TIMER",
    PAUSE_TIMER = "PAUSE_TIMER",
    RESTART_TIMER = "RESTART_TIMER",
    OTHER_ACTION = "__any_other_action_type__",
}

export interface SocketAction {
    type: Actions,
    meta: {
        remote: boolean
    },
    payload: Object
}
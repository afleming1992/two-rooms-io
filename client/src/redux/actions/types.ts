export enum Actions {
    CONNECTED="CONNECTED",
    DISCONNECTED="DISCONNECTED",
    JOIN_GAME = "JOIN_GAME",
    HIDE_ERROR = "HIDE_ERROR",
    OTHER_ACTION = "__any_other_action_type__"
}

export interface SocketAction {
    type: Actions,
    meta: {
        remote: boolean
    },
    payload: Object
}
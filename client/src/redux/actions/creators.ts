import {SocketAction, Actions} from "./types";

const joinGame = (name: string): SocketAction => {
    return {
        type: Actions.JOIN_GAME,
        meta: {
            remote: true
        },
        payload: {
            name
        }
    }
}

export default {
    joinGame
}


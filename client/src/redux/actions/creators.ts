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

const nextRound = (): SocketAction => {
    return {
        type: Actions.NEXT_ROUND,
        meta: {
            remote: true
        },
        payload: {}
    }
}

const startTimer = (): SocketAction => {
    return {
        type: Actions.START_TIMER,
        meta: {
            remote: true
        },
        payload: {}
    }
}

const pauseTimer = (): SocketAction => {
    return {
        type: Actions.PAUSE_TIMER,
        meta: {
            remote: true
        },
        payload: {}
    }
}

const restartTimer = (): SocketAction => {
    return {
        type: Actions.RESTART_TIMER,
        meta: {
            remote: true
        },
        payload: {}
    }
}

const reloadGameSession = (gameToken: String, playerToken: String, playerSecret: String): SocketAction => {
    return {
        type: Actions.RELOAD_GAME_SESSION,
        meta: {
            remote: true
        },
        payload: {
            gameToken,
            playerToken,
            playerSecret
        }
    }
}

export default {
    joinGame,
    nextRound,
    startTimer,
    pauseTimer,
    restartTimer,
    reloadGameSession
}


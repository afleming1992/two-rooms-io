import {SocketAction, Actions} from "./types";
import {CardShareType} from "../../domain/Sharing";

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

const requestShare = ( type: CardShareType, recipient: string) => {
    return {
        type: Actions.REQUEST_SHARE,
        meta: {
            remote: true
        },
        payload: {
            type,
            recipient
        }
    }
}

const acceptShare = ( id: string ) => {
    return {
        type: Actions.ACCEPT_SHARE,
        meta: {
            remote: true
        },
        payload: {
            requestId: id
        }
    }
}

const rejectShare = ( id: string ) => {
    return {
        type: Actions.REJECT_SHARE,
        meta: {
            remote: true
        },
        payload: {
            requestId: id
        }
    }
}

const privateReveal = ( type: CardShareType, recipient: string ) => {
    return {
        type: Actions.PRIVATE_REVEAL,
        meta: {
            remote: true
        },
        payload: {
            type,
            recipient
        }
    }
}

const dismissEvent = ( id: string ) => {
    return {
        type: Actions.DISMISS_EVENT,
        payload: {
            id
        }
    }
}

const revealPlayerAssignment = ( cardKey: string ) => {
    return {
        type: Actions.REVEAL_CARD_ASSIGNMENT,
        meta: {
            remote: true
        },
        payload: {
            card: cardKey
        }
    }
}

const creators = {
    joinGame,
    nextRound,
    startTimer,
    pauseTimer,
    restartTimer,
    reloadGameSession,
    requestShare,
    acceptShare,
    rejectShare,
    privateReveal,
    dismissEvent,
    revealPlayerAssignment
}

export default creators;


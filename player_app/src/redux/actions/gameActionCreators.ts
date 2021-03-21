import {SocketAction, Actions} from "./types";
import {CardShareType} from "../../domain/Sharing";
import {User} from "../../domain/User";

export const createGame = (name: string): SocketAction => {
    return {
        type: Actions.CREATE_GAME,
        meta: {
            remote: true
        },
        payload: {
            name
        }
    }
}

export const joinGame = (name: string, joinGameCode: string): SocketAction => {
    return {
        type: Actions.JOIN_GAME,
        meta: {
            remote: true
        },
        payload: {
            name,
            joinGameCode
        }
    }
}

export const nextRound = (): SocketAction => {
    return {
        type: Actions.NEXT_ROUND,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const startTimer = (): SocketAction => {
    return {
        type: Actions.START_TIMER,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const pauseTimer = (): SocketAction => {
    return {
        type: Actions.PAUSE_TIMER,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const restartTimer = (): SocketAction => {
    return {
        type: Actions.RESTART_TIMER,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const reloadGameSession = (gameId: String, playerToken: String, playerSecret: String): SocketAction => {
    return {
        type: Actions.RELOAD_GAME_SESSION,
        meta: {
            remote: true,
        },
        payload: {
            gameId,
            playerToken,
            playerSecret
        }
    }
}

export const requestShare = ( type: CardShareType, recipient: User) => {
    return {
        type: Actions.REQUEST_SHARE,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {
            type,
            recipient: recipient.userToken
        }
    }
}

export const acceptShare = ( id: string ) => {
    return {
        type: Actions.ACCEPT_SHARE,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {
            requestId: id
        }
    }
}

export const rejectShare = ( id: string ) => {
    return {
        type: Actions.REJECT_SHARE,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {
            requestId: id
        }
    }
}

export const privateReveal = ( type: CardShareType, recipient: User ) => {
    return {
        type: Actions.PRIVATE_REVEAL,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {
            type,
            recipient: recipient.userToken
        }
    }
}

export const respondToEvent = ( id: string ) => {
    return {
        type: Actions.RESPOND_TO_EVENT,
        payload: {
            id
        }
    }
}

export const dismissEvent = ( id: string ) => {
    return {
        type: Actions.DISMISS_EVENT,
        payload: {
            id
        }
    }
}

export const revealPlayerAssignment = ( cardKey: string ) => {
    return {
        type: Actions.REVEAL_CARD_ASSIGNMENT,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {
            card: cardKey
        }
    }
}

const gameActionCreators = {
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

export default gameActionCreators;


import {SocketAction, GameAction} from "./types";
import {CardShareType} from "../../domain/Sharing";
import {User} from "../../domain/User";
import {RoomName} from "../../domain/Room";
import {Vote} from "../../domain/Vote";

export const createGame = (name: string): SocketAction => {
    return {
        type: GameAction.CREATE_GAME,
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
        type: GameAction.JOIN_GAME,
        meta: {
            remote: true
        },
        payload: {
            name,
            joinGameCode
        }
    }
}

export const startGame = (): SocketAction => {
    return {
        type: GameAction.START_GAME,
        meta: {
            remote: true
        },
        payload: {}
    }
}

export const nextRound = (): SocketAction => {
    return {
        type: GameAction.NEXT_ROUND,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const startTimer = (): SocketAction => {
    return {
        type: GameAction.START_TIMER,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const pauseTimer = (): SocketAction => {
    return {
        type: GameAction.PAUSE_TIMER,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const restartTimer = (): SocketAction => {
    return {
        type: GameAction.RESTART_TIMER,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {}
    }
}

export const reloadGameSession = (gameId: String, playerToken: String, playerSecret: String): SocketAction => {
    return {
        type: GameAction.RELOAD_GAME_SESSION,
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
        type: GameAction.REQUEST_SHARE,
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
        type: GameAction.ACCEPT_SHARE,
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
        type: GameAction.REJECT_SHARE,
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
        type: GameAction.PRIVATE_REVEAL,
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
        type: GameAction.RESPOND_TO_EVENT,
        payload: {
            id
        }
    }
}

export const dismissEvent = ( id: string ) => {
    return {
        type: GameAction.DISMISS_EVENT,
        payload: {
            id
        }
    }
}

export const revealPlayerAssignment = ( cardKey: string ) => {
    return {
        type: GameAction.REVEAL_CARD_ASSIGNMENT,
        meta: {
            remote: true,
            isGameRequest: true
        },
        payload: {
            card: cardKey
        }
    }
}

export const nominateLeader = (roomName: RoomName, player: User) => {
    return nominateAction(GameAction.NOMINATE_LEADER, roomName, player);
}

export const nominateHostage = (roomName: RoomName, player: User) => {
    return nominateAction(GameAction.NOMINATE_HOSTAGE, roomName, player);
}

export const abdicateAsLeader = (roomName: RoomName, player: User) => {
    return nominateAction(GameAction.ABDICATE_AS_LEADER, roomName, player);
}

export const usurpLeader = (roomName: RoomName, player: User) => {
    return nominateAction(GameAction.USURP_LEADER, roomName, player);
}

export const answerLeadershipOffer = (roomName: RoomName, vote: Vote) => {
    return voteAction(GameAction.ANSWER_LEADERSHIP_OFFER, roomName, vote);
}

export const usurpVote = (roomName: RoomName, vote: Vote) => {
    return voteAction(GameAction.USURP_VOTE, roomName, vote);
}

const voteAction = (actionType: GameAction, roomName: RoomName, vote: Vote) => {
    return {
        type: actionType,
        meta: {
            remote: true
        },
        payload: {
            room: roomName,
            vote: vote
        }
    }
}

const nominateAction = (actionType: GameAction, roomName: RoomName, player: User) => {
    return {
        type: actionType,
        meta: {
            remote: true
        },
        payload: {
            room: roomName,
            nominee: player.userToken
        }
    }
}

const gameActionCreators = {
    joinGame,
    nextRound,
    startGame,
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


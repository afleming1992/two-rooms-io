import {Listeners} from "../actions/listeners";

export interface SessionState {
    game: String | undefined,
    token: String | undefined,
    secret: String | undefined
}

const initialState: SessionState = {
    game: undefined,
    token: undefined,
    secret: undefined,
}

export default function session(state = initialState, action: any) {
    switch(action.type) {
        case Listeners.JOIN_GAME_SUCCESS:
            return Object.assign( {}, state, {
                game: action.data.gameToken,
                token: action.data.userToken,
                secret: action.data.userSecret
            })
        case Listeners.RELOAD_GAME_SESSION_ERROR:
            return initialState;
        default:
            return state
    }
}
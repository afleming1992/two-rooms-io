import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";

export interface PlayerState {
    connected: boolean
    joining: boolean
    userToken: string | undefined
    name: string | undefined
}

const initialState: PlayerState = {
    connected: false,
    joining: false,
    userToken: undefined,
    name: undefined
}

export default function player(state = initialState, action: any) {
    switch(action.type) {
        case Actions.CONNECTED:
            return Object.assign( {}, state, { connected: true } );
        case Actions.DISCONNECTED:
            return Object.assign( {}, state, { connected: false } );
        case Actions.JOIN_GAME:
            return Object.assign({}, state, { joining: true, name: action.name });
        case Listeners.JOIN_GAME_SUCCESS:
        case Listeners.RELOAD_GAME_SESSION_SUCCESS:
            return Object.assign( {}, state, { connected: true, joining: false, userToken: action.data.userToken } );
        case Listeners.RELOAD_GAME_SESSION_ERROR:
            return Object.assign( {}, state, { connected: true } );
        case Listeners.JOIN_GAME_ERROR:
            return Object.assign( {}, state, {
                joining: false
            });
        default:
            return state;
    }
}
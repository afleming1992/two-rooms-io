import {PlayerState} from "./types";
import {Actions} from "../actions/types";
import {Action} from "typesafe-actions";
import {Listeners} from "../actions/listeners";

const initialState: PlayerState = {
    connected: false,
    joining: false,
    inGame: false,
    userToken: undefined,
    gameToken: undefined
}

export default function player(state = initialState, action: any) {
    switch(action.type) {
        case Actions.JOIN_GAME:
            return Object.assign({}, state, { joining: true });
        case Listeners.JOIN_GAME_SUCCESS:
            return Object.assign( {}, state, {} );
        case Listeners.JOIN_GAME_ERROR:
            return Object.assign( {}, state, {
                joining: false
            });
        default:
            return state;
    }
}
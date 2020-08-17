import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";

export enum ViewState {
    JOIN_GAME,
    IN_LOBBY,
    IN_ROUND,
    BETWEEN_ROUND,
    END_GAME
}


const initialState = ViewState.JOIN_GAME;

export default function viewReducer(state = initialState, action: any) {
    switch( action.type ) {
        case Actions.DISCONNECTED:
            return ViewState.JOIN_GAME
        case Listeners.JOIN_GAME_SUCCESS:
            return ViewState.IN_LOBBY;
        case Listeners.GAME_UPDATE:
            if( action.data.round > 0) {
                if( action.data.round > action.data.roundData.length ) {
                    return ViewState.END_GAME;
                } else {
                    return ViewState.IN_ROUND
                }
            }
            return state;
        default:
            return state;
    }
}
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
        case Listeners.JOIN_GAME_SUCCESS:
            return ViewState.IN_LOBBY;
        default:
            return state;
    }
}
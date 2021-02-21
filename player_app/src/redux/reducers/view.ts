import {GameAction} from "../actions/types";
import {Listeners} from "../actions/listeners";

export enum ViewState {
    JOIN_GAME,
    IN_LOBBY,
    BEGIN_GAME,
    IN_ROUND,
    END_ROUND,
    END_GAME
}

const initialState = ViewState.JOIN_GAME;

export default function viewReducer(state = initialState, action: any) {
    switch( action.type ) {
        case GameAction.DISCONNECTED:
            return ViewState.JOIN_GAME
        case Listeners.JOIN_GAME_SUCCESS:
            return ViewState.IN_LOBBY;
        case Listeners.GAME_UPDATE:
            switch( action.data.stage ) {
                case "CREATED":
                    return ViewState.IN_LOBBY
                case "FIRST_ROOM_ALLOCATION":
                    return ViewState.BEGIN_GAME
                case "IN_ROUND":
                    return ViewState.IN_ROUND
                case "END_OF_ROUND":
                    return ViewState.END_ROUND
                case "RESULTS":
                    return ViewState.END_GAME
            }
            return state;
        default:
            return state;
    }
}
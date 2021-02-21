import {GameAction} from "../actions/types";
import {Listeners} from "../actions/listeners";

export interface ErrorState {
    error: any,
    isOpen: boolean
}

export default function errorsReducer(state = {}, action: any) {
    switch( action.type ) {
        case Listeners.JOIN_GAME_ERROR:
            const data = action.data;
            return {
                error: data.message,
                isOpen: true
            }
        case GameAction.HIDE_ERROR:
            return {
                error: null,
                isOpen: false
            }
        default:
            return state;
    }
}
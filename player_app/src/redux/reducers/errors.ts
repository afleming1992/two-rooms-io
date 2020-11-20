import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";

export default function errorsReducer(state = {}, action: any) {
    switch( action.type ) {
        case Listeners.JOIN_GAME_ERROR:
            const data = action.data;
            return {
                error: data.message,
                isOpen: true
            }
        case Actions.HIDE_ERROR:
            return {
                error: null,
                isOpen: false
            }
        default:
            return state;
    }
}
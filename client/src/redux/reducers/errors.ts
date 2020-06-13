import {PlayerState} from "./types";
import {Actions} from "../actions/types";

export default function errorsReducer(state = {}, action: any) {
    const data = action.data;

    if( data && !data.success ) {
        return {
            error: data.message,
            isOpen: true
        }
    } else if( action.type === Actions.HIDE_ERROR ) {
        return {
            error: null,
            isOpen: false
        }
    }

    return state;
}
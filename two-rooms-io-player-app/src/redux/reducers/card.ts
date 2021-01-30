import {Listeners} from "../actions/listeners";
import {ViewState} from "./view";
import {Card} from "../../domain/Card";

export interface CardState {
    card: Card | undefined
}

const initialState = {
    card: undefined
}

export default function cardReducer(state = initialState, action: any) {
    switch( action.type ) {
        case Listeners.CARD_UPDATE:
            return Object.assign({}, state, { card: action.data } );
        default:
            return state;
    }
}
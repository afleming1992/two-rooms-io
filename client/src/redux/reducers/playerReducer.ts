import { initialState } from './initialState';
import {JOIN_GAME, JOIN_GAME_ERROR, JOIN_GAME_SUCCESS} from "../actions/actionTypes";
import {Action} from "typesafe-actions";

export default function playerReducer(state = initialState.player, action: Action) {
    switch(action.type) {
        case JOIN_GAME:
            return Object.assign({}, state, {
                joining: true
            });
        case JOIN_GAME_SUCCESS:
            return Object.assign({}, {loading: false});
        case JOIN_GAME_ERROR:
            return Object.assign({}, state, {
                joining: false
            });
        default:
            return state;
    }
}
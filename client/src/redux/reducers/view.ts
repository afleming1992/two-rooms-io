import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";
import {GameStage} from "../../domain/GameStage";

export enum ViewState {
    JOIN_GAME,
    IN_LOBBY,
    INITIAL_ROOM_ALLOCATION,
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
            switch( action.data.stage ) {
                case GameStage.CREATED:
                    return ViewState.IN_LOBBY;
                case GameStage.FIRST_ROOM_ALLOCATION:
                    return ViewState.INITIAL_ROOM_ALLOCATION
                case GameStage.IN_ROUND:
                    return ViewState.IN_ROUND
                case GameStage.END_OF_ROUND:
                    return ViewState.BETWEEN_ROUND
                case GameStage.RESULTS:
                    return ViewState.END_GAME;
            }
            return state;
        default:
            return state;
    }
}
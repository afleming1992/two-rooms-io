import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";
import {User} from "../../domain/User";
import {List} from "semantic-ui-react";
import {Card} from "../../domain/Card";

export interface GameState {
    id: string | undefined,
    host: User | undefined,
    round: number | undefined,
    players: Array<User> | undefined
    deck: Array<Card> | undefined
}

const initialState: GameState = {
    id: undefined,
    host: undefined,
    round: undefined,
    players: new Array<User>(),
    deck: new Array<Card>()
}

export default function gameReducer(state: GameState = initialState, action: any) {
    switch( action.type ) {
        case Listeners.GAME_UPDATE:
            return action.data;
        default:
            return state;
    }
}
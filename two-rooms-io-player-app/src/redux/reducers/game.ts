import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";
import {User} from "../../domain/User";
import {Card} from "../../domain/Card";
import Round from "../../domain/Round";
import {CardReveal} from "../../domain/CardReveal";

export interface GameState {
    id: string | undefined,
    host: User | undefined,
    round: number | undefined,
    players: Array<User> | undefined
    deck: Array<Card> | undefined,
    roundData: Array<Round> | undefined,
    revealedCardAssignments: CardReveal[]
}

const initialState: GameState = {
    id: undefined,
    host: undefined,
    round: undefined,
    players: new Array<User>(),
    deck: new Array<Card>(),
    roundData: new Array<Round>(),
    revealedCardAssignments: new Array<CardReveal>()
}

export default function gameReducer(state: GameState = initialState, action: any) {
    switch( action.type ) {
        case Actions.DISCONNECTED:
            return initialState;
        case Listeners.GAME_UPDATE:
            return {...state, players: action.data.players, round: action.data.round, roundData: action.data.roundData, host: action.data.host, id: action.data.id, deck: action.data.deck, revealedCardAssignments: action.data.revealedCardAssignments }
        default:
            return state;
    }
}
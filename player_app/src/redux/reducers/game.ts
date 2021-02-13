import {Actions} from "../actions/types";
import {Listeners} from "../actions/listeners";
import {User} from "../../domain/User";
import {Card} from "../../domain/Card";
import Round from "../../domain/Round";
import {CardReveal} from "../../domain/CardReveal";
import Room, {RoomName} from "../../domain/Room";

export interface GameState {
    id: string | undefined,
    joinCode: string | undefined,
    host: User | undefined,
    round: number | undefined,
    players: Array<User> | undefined
    deck: Array<Card> | undefined,
    roundData: Array<Round> | undefined,
    revealedCardAssignments: CardReveal[],
    rooms: Map<RoomName, Room>
}

const initialState: GameState = {
    id: undefined,
    joinCode: undefined,
    host: undefined,
    round: undefined,
    players: new Array<User>(),
    deck: new Array<Card>(),
    roundData: new Array<Round>(),
    revealedCardAssignments: [],
    rooms: new Map<RoomName, Room>()
}

export default function gameReducer(state: GameState = initialState, action: any) {
    switch( action.type ) {
        case Actions.DISCONNECTED:
            return initialState;
        case Listeners.GAME_UPDATE:
            return {
                ...state,
                players: action.data.players,
                round: action.data.round,
                roundData: action.data.roundData,
                host: action.data.host,
                id: action.data.id,
                joinCode: action.data.joinCode,
                deck: action.data.deck,
                revealedCardAssignments: action.data.revealedCardAssignments,
                rooms: action.data.rooms
            }
        default:
            return state;
    }
}
import {RevealActions} from "../actions/types";
import {Card} from "../../domain/Card";
import {Team} from "../../domain/Team";
import {User} from "../../domain/User";
import GameEvent, {GameEventType} from "../../domain/GameEvent";

interface RevealState {
    isOpen: boolean,
    player: User | undefined,
    card: Card | undefined,
    team: Team | undefined,
}

const initialState: RevealState = {
    isOpen: false,
    player: undefined,
    card: undefined,
    team: undefined
}

export default function reveal(state = initialState, action: any) {
    switch( action.type ) {
        case RevealActions.DO_REVEAL:
            const event: GameEvent = action.data.event;
            switch ( event.type ) {
                case GameEventType.COLOUR_SHARE:
                case GameEventType.COLOUR_REVEAL:
                    return { ...state, isOpen: true, team: event.shownColour, player: action.data.player }
                case GameEventType.ROLE_SHARE:
                case GameEventType.ROLE_REVEAL:
                    return { ...state, isOpen: true, card: event.shownCard, player: action.data.player }
                default:
                    return state;
            }
        case RevealActions.CLEAR_REVEAL:
            return {...state, isOpen: false, player: undefined, card: undefined, team: undefined }
        default:
            return state;
    }
}
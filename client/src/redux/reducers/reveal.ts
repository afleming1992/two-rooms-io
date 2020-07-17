import {RevealActions} from "../actions/types";
import {Card} from "../../domain/Card";
import {Team} from "../../domain/Team";
import {User} from "../../domain/User";
import GameEvent, {GameEventType} from "../../domain/GameEvent";

interface RevealState {
    isOpen: boolean,
    player: string | undefined,
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
        case RevealActions.DO_COLOUR_REVEAL:
            return { ...state, isOpen: true, team: action.data.shownColour, player: action.data.playerName}
        case RevealActions.DO_CARD_REVEAL:
            return { ...state, isOpen: true, card: action.data.shownCard, player: action.data.playerName }
        case RevealActions.CLEAR_REVEAL:
            return {...state, isOpen: false, player: undefined, card: undefined, team: undefined }
        default:
            return state;
    }
}
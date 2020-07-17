import {RevealActions} from "./types";
import GameEvent from "../../domain/GameEvent";
import {User} from "../../domain/User";
import {Reveal} from "semantic-ui-react";
import {Team} from "../../domain/Team";
import {Card} from "../../domain/Card";

const doColourReveal = (eventId: string, shownColour: Team, playerName: String) => {
    return {
        type: RevealActions.DO_COLOUR_REVEAL,
        data: {
            eventId,
            shownColour,
            playerName,
        }
    }
}

const doCardReveal = (eventId: string, shownCard: Card, playerName: String) => {
    return {
        type: RevealActions.DO_CARD_REVEAL,
        data: {
            eventId,
            shownCard,
            playerName
        }
    }
}

const clearReveal = () => {
    return {
        type: RevealActions.CLEAR_REVEAL
    }
}

export default {
    doCardReveal,
    doColourReveal,
    clearReveal
}
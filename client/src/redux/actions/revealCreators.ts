import {RevealActions} from "./types";
import GameEvent from "../../domain/GameEvent";
import {User} from "../../domain/User";

const doReveal = ( event: GameEvent, player: User ) => {
    return {
        type: RevealActions.DO_REVEAL,
        data: {
            event,
            player
        }
    }
}

const clearReveal = () => {
    return {
        type: RevealActions.CLEAR_REVEAL
    }
}

export default {
    doReveal,
    clearReveal
}
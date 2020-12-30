import {RevealActions} from "./types";

const doReveal = (eventId: string) => {
    return {
        type: RevealActions.DO_REVEAL,
        data: {
            eventId,
        }
    }
}

const clearReveal = (eventId: string) => {
    return {
        type: RevealActions.CLEAR_REVEAL,
        data: {
            eventId
        }
    }
}

export default {
    doReveal,
    clearReveal
}
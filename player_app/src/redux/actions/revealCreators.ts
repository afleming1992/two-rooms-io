import {RevealActions} from "./types";

export const doReveal = (eventId: string) => {
    return {
        type: RevealActions.DO_REVEAL,
        data: {
            eventId,
        }
    }
}

export const clearReveal = (eventId: string) => {
    return {
        type: RevealActions.CLEAR_REVEAL,
        data: {
            eventId
        }
    }
}
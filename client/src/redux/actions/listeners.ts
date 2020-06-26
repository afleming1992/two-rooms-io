export enum Listeners {
    JOIN_GAME_SUCCESS= "JOIN_GAME_SUCCESS",
    JOIN_GAME_ERROR = "JOIN_GAME_ERROR",
    GAME_UPDATE = "GAME_UPDATE",
    CARD_UPDATE = "CARD_UPDATE",
    TIMER_UPDATE = "TIMER_UPDATE",
    RELOAD_GAME_SESSION_SUCCESS = "RELOAD_GAME_SESSION_SUCCESS",
    RELOAD_GAME_SESSION_ERROR = 'RELOAD_GAME_SESSION_ERROR'
}

export const actionListeners = () => {
    let enumValues:Array<string> = [];

    for(let value in Listeners) {
        enumValues.push( value );
    }

    return enumValues;
}
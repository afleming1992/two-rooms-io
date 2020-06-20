export enum Listeners {
    JOIN_GAME_SUCCESS= "JOIN_GAME_SUCCESS",
    JOIN_GAME_ERROR = "JOIN_GAME_ERROR",
    GAME_UPDATE = "GAME_UPDATE",
    CARD_UPDATE = "CARD_UPDATE",
    TIMER_UPDATE = "TIMER_UPDATE"
}

export const actionListeners = () => {
    let enumValues:Array<string> = [];

    for(let value in Listeners) {
        enumValues.push( value );
    }

    return enumValues;
}
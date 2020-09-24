import {Card} from "./Card";
import {Team} from "./Team";
import {RequestResponse} from "./RequestResponse";
import * as uuid from "uuid";
import deepEquals from "deep-equal";

export enum GameEventType {
    COLOUR_SHARE = "COLOUR_SHARE",
    ROLE_SHARE = "ROLE_SHARE",
    SHARE_REJECT = "SHARE_REJECT",
    COLOUR_REVEAL = "COLOUR_REVEAL",
    ROLE_REVEAL = "ROLE_REVEAL",
    INFO = "INFO",
    IMPORTANT = "IMPORTANT"
}

export default class GameEvent {
    public id: string | undefined;
    public type: GameEventType;
    public requestor: string;
    public recipient: string | undefined;
    public responded: boolean = false;
    public accepted: boolean | undefined;
    public shownColour: Team | undefined;
    public shownCard: Card | undefined;
    public recipientResponse: RequestResponse = RequestResponse.NO_ANSWER;

    constructor( type: GameEventType, requestor: string ) {
        this.type = type;
        this.requestor = requestor;
    }

    static roleRequest( id: string, requestor: string, recipient: string ) {
        let gameEvent = new GameEvent( GameEventType.ROLE_SHARE, requestor );
        gameEvent.id = id;
        gameEvent.recipient = recipient;
        return gameEvent;
    }

    static colourRequest( id: string, requestor: string, recipient: string ) {
        let gameEvent = new GameEvent( GameEventType.COLOUR_SHARE, requestor);
        gameEvent.id = id;
        gameEvent.recipient = recipient;
        return gameEvent;
    }

    static privateRoleReveal( requestor: string, card: Card ) {
        let gameEvent = new GameEvent( GameEventType.ROLE_REVEAL, requestor );
        gameEvent.id = uuid.v4();
        gameEvent.shownCard = card;
        return gameEvent;
    }

    static privateColourReveal( requestor: string, colour: Team ) {
        let gameEvent = new GameEvent( GameEventType.COLOUR_REVEAL, requestor );
        gameEvent.id = uuid.v4();
        gameEvent.shownColour = colour;
        return gameEvent;
    }

    equals( otherEvent : GameEvent ) {
        return deepEquals( this, otherEvent );
    }
}
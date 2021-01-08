import {RequestResponse} from "./RequestResponse";
import {Card} from "./Card";
import * as uuid from "uuid";
import {Team} from "./Team";

export enum EventType {
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
  public lastUpdated: Date;
  public systemEvent: boolean;
  public type: EventType;
  public requestor: string | undefined;
  public recipient: string | undefined;
  public responded: boolean = false;
  public accepted: boolean | undefined;
  public recipientResponse: RequestResponse = RequestResponse.NO_RESPONSE;

  constructor( type: EventType, systemEvent: boolean, requestor: string ) {
    this.type = type;
    this.systemEvent = systemEvent;
    this.requestor = requestor;
    this.lastUpdated = new Date();
  }

  static roleRequest( id: string, requestor: string, recipient: string ) {
    let gameEvent = new GameEvent( EventType.ROLE_SHARE, false, requestor );
    gameEvent.id = id;
    gameEvent.recipient = recipient;
    return gameEvent;
  }

  static colourRequest( id: string, requestor: string, recipient: string ) {
    let gameEvent = new GameEvent( EventType.COLOUR_SHARE, false, requestor);
    gameEvent.id = id;
    gameEvent.recipient = recipient;
    return gameEvent;
  }

  static privateRoleReveal( id: string, requestor: string ) {
    let gameEvent = new GameEvent( EventType.ROLE_REVEAL, false, requestor );
    gameEvent.id = id;
    return gameEvent;
  }

  static privateColourReveal( id: string, requestor: string ) {
    let gameEvent = new GameEvent( EventType.COLOUR_REVEAL, false, requestor );
    gameEvent.id = id;
    return gameEvent;
  }
}
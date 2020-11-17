import GameEvent from "../../domain/GameEvent";
import {Listeners} from "../actions/listeners";
import {Actions} from "../actions/types";
import {RequestResponse} from "../../domain/RequestResponse";

export interface EventsState {
    awaitingResponse: Array<GameEvent>,
    pending: Array<GameEvent>
}

const initialState: EventsState = {
    awaitingResponse: new Array<GameEvent>(),
    pending: new Array<GameEvent>()
}

export default function eventsReducer(state: EventsState = initialState, action: any) {
    let gameEvent = undefined;
    let awaitingEvents = [...state.awaitingResponse];
    let pendingEvents = [...state.pending];
    switch( action.type ) {
        case Listeners.REQUEST_SHARE_SUCCESS:
            gameEvent = buildGameEventForShare( action.data );
            if ( gameEvent !== undefined ) {
                awaitingEvents.push( gameEvent );
            }
            return {...state, awaitingResponse: awaitingEvents}
        case Listeners.SHARE_REQUEST_RECEIVED:
            gameEvent = buildGameEventForShare( action.data );
            if ( gameEvent !== undefined ) {
                pendingEvents.push( gameEvent );
            }
            return {...state, pending: pendingEvents}
        case Actions.ACCEPT_SHARE:
            return {...state, pending: updateEventToResponded( state.pending, action.payload.requestId, true)}
        case Actions.REJECT_SHARE:
            return {...state, pending: updateEventToResponded( state.pending, action.payload.requestId, false)}
        case Listeners.CARD_SHARE_ACCEPTED:
            updateEventsOnShareAccept( pendingEvents, action.data );
            updateEventsOnShareAccept( awaitingEvents, action.data );
            return {...state, pending: pendingEvents, awaitingResponse: awaitingEvents }
        case Listeners.PRIVATE_REVEAL_RECEIVED:
            if ( action.data.type === "ROLE" ) {
                gameEvent = buildGameEventForReveal( action.data )
            } else {
                gameEvent = buildGameEventForReveal( action.data )
            }

            if( gameEvent !== undefined ) {
                pendingEvents.push( gameEvent );
            }

            return {...state, pending: pendingEvents}
        case Listeners.SHARE_REQUEST_REJECTED:
            updateEventsOnShareDecline( pendingEvents, action.data );
            updateEventsOnShareDecline( awaitingEvents, action.data );
            return {...state, pending: pendingEvents, awaitingResponse: awaitingEvents }
        case Listeners.REJECT_SHARE_SUCCESS:
            pendingEvents = removeEvent(pendingEvents, action.data.id);
            return {...state, pending: pendingEvents };
        case Actions.DISMISS_EVENT:
            return {...state, pending: removeEvent(pendingEvents, action.payload.id), awaitingResponse: removeEvent(awaitingEvents, action.payload.id) }
        case Listeners.CLEAR_EVENTS:
            return {...state, pending: new Array<GameEvent>(), awaitingResponse: new Array<GameEvent>()}
        default:
            return state;
    }
}

const buildGameEventForShare = ( data: any ) => {
    let gameEvent = undefined;

    if ( data.type === "ROLE" ) {
        gameEvent = GameEvent.roleRequest( data.id, data.requestor, data.recipient );
    } else if ( data.type === "COLOUR" ) {
        gameEvent = GameEvent.colourRequest( data.id, data.requestor, data.recipient );
    }

    return gameEvent;
}

const buildGameEventForReveal = ( data: any ) => {
    let gameEvent = undefined;

    if ( data.type === "ROLE" ) {
        gameEvent = GameEvent.privateRoleReveal( data.userToken, data.role );
    } else if ( data.type === "COLOUR" ) {
        gameEvent = GameEvent.privateColourReveal( data.userToken, data.team );
    }

    return gameEvent;
}

const updateEventToResponded = ( events : Array<GameEvent>, event_id: String, accepted: boolean) => {
    const updatedEvents = [...events];

    updatedEvents.forEach( ( event ) => {
      if( event.id === event_id ) {
          event.responded = true;
          event.accepted = accepted;
      }
    } )

    return updatedEvents;
}

const updateEventsOnShareAccept = ( events: Array<GameEvent>, shareInfo: any ) => {
    const updatedEvents = [...events];

    updatedEvents.forEach( ( event ) => {
        if( event.id === shareInfo.requestId ) {
            event.recipientResponse = RequestResponse.ACCEPTED;
            if ( shareInfo.type === "ROLE" ) {
                event.shownCard = shareInfo.role;
            } else {
                event.shownColour = shareInfo.team;
            }
        }
    })

    return updatedEvents;
}

const updateEventsOnShareDecline = (events: Array<GameEvent>, shareInfo: any ) => {
    const updatedEvents = [...events];

    updatedEvents.forEach((  event) => {
        if ( event.id === shareInfo.requestId ) {
            event.recipientResponse = RequestResponse.DECLINED;
        }
    })

    return updatedEvents;
}

const removeEvent = (events: Array<GameEvent>, idTobeRemoved: string ) => {
    let updatedEvents = [...events];

    updatedEvents = updatedEvents.filter( event => event.id !== idTobeRemoved )

    return updatedEvents;
}
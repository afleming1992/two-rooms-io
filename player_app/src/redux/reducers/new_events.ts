import GameEvent from "../../domain/GameEvent";
import {Listeners} from "../actions/listeners";
import {Actions} from "../actions/types";
import {RequestResponse} from "../../domain/RequestResponse";

export interface EventsState {
  timeline: Array<GameEvent>
}

const initialState: EventsState = {
  timeline: new Array<GameEvent>()
}

export default function eventsReducer(state: EventsState = initialState, action: any) {
  let timeline = [...state.timeline];

  switch( action.type ) {
    case Listeners.REQUEST_SHARE_SUCCESS:
    case Listeners.SHARE_REQUEST_RECEIVED:
      timeline.push( buildEventForShare( action.data ) )
      return {...state, timeline}
    case Actions.ACCEPT_SHARE:
      return {...state, timeline: updateEventToResponded( timeline, action.payload.requestId, RequestResponse.ACCEPTED )}
    case Actions.REJECT_SHARE:
      return {...state, timeline: updateEventToResponded( timeline, action.payload.requestId, RequestResponse.DECLINED )}
    case Listeners.CARD_SHARE_ACCEPTED:
      return {...state, timeline: updateEventToResponded( timeline, action.data.requestId, RequestResponse.ACCEPTED )}
    case Listeners.SHARE_REQUEST_REJECTED:
      return {...state, timeline: updateEventToResponded( timeline, action.data.id, RequestResponse.DECLINED )}
    case Listeners.REJECT_SHARE_SUCCESS:
      return {...state, timeline: updateEventToResponded( timeline, action.data.requestId, RequestResponse.DECLINED )}
    case Listeners.PRIVATE_REVEAL_RECEIVED:
      timeline.push( buildEventForReveal( action.data ) )
      return {...state, timeline}
    case Actions.RESPOND_TO_EVENT:
      respondToEvent( timeline, action.payload.id )
      return {...state, timeline}
    case Actions.DISMISS_EVENT:
      timeline = removeEvent( timeline, action.payload.id)
      return {...state, timeline}
    case Listeners.CLEAR_EVENTS:

      return {...initialState}
    default:
      return state;
  }
}

const buildEventForShare = ( data: any ) => {
  if ( data.type === "ROLE" ) {
    return GameEvent.roleRequest( data.id, data.requestor, data.recipient );
  } else {
    return GameEvent.colourRequest( data.id, data.requestor, data.recipient );
  }
}

const buildEventForReveal = ( data: any ) => {
  if ( data.type === "ROLE" ) {
    return GameEvent.privateRoleReveal( data.requestId, data.userToken )
  } else {
    return GameEvent.privateColourReveal( data.requestId, data.userToken )
  }
}

const updateEventToResponded = ( timeline: Array<GameEvent>, eventId: string, recipientResponse?: RequestResponse ) => {
  const updatedEvents = [...timeline]

  updatedEvents.forEach( (event) => {
    if ( event.id === eventId ) {
      event.responded = true;
      if ( recipientResponse ) {
        event.recipientResponse = recipientResponse;
      }
    }
  });

  return updatedEvents
}

const respondToEvent = (events: Array<GameEvent>, idToBeActioned: string) => {
  let updatedEvents = [...events];

  updatedEvents.forEach((event) => {
    if( event.id === idToBeActioned ) {
      event.revealViewed = true;
    }
  });

  return updatedEvents;
}

const removeEvent = (events: Array<GameEvent>, idToBeRemoved: string ) => {
  let updatedEvents = [...events];

  updatedEvents = updatedEvents.filter( event => event.id !== idToBeRemoved)

  return updatedEvents;
}
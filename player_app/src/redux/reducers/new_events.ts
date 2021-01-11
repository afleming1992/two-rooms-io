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
    case Actions.REJECT_SHARE:
      return {...state, pending: updateEventToResponded( timeline, action.payload.requestId, action.type === Actions.ACCEPT_SHARE )}
    case Listeners.CARD_SHARE_ACCEPTED:
      updateShareEventOnResponse( timeline, action.data.requestId, RequestResponse.ACCEPTED );
      return {...state, timeline}
    case Listeners.SHARE_REQUEST_REJECTED:
    case Listeners.REJECT_SHARE_SUCCESS:
      updateShareEventOnResponse( timeline, action.data.requestId, RequestResponse.DECLINED );
      return {...state, timeline}
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

const updateEventToResponded = ( timeline: Array<GameEvent>, eventId: string, accepted: boolean ) => {
  const updatedEvents = [...timeline]

  updatedEvents.forEach( (event) => {
    if ( event.id === eventId ) {
      event.responded = true;
      event.accepted = accepted;
    }
  });

  return updatedEvents
}

const updateShareEventOnResponse = ( timeline: Array<GameEvent>, eventId : string, result: RequestResponse) => {
  const updatedEvents = [...timeline]

  updatedEvents.forEach( (event) => {
    if ( event.id === eventId ) {
      event.recipientResponse = result;
    }
  })

  return updatedEvents;
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
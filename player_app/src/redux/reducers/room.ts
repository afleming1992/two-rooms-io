import {User} from "../../domain/User";
import {Listeners} from "../actions/listeners";
import {RoomName} from "../../domain/Room";

export interface RoomState {
  currentRoom: RoomName | undefined,
  currentLeader: User | undefined,
  playersInRoom: User[] | undefined,
  hostages: User[]
}

const initialState: RoomState = {
  currentRoom: undefined,
  currentLeader: undefined,
  playersInRoom: undefined,
  hostages: []
}

export default function roomReducer(state: RoomState = initialState, action: any) {
  switch( action.type ) {
    case Listeners.JOIN_ROOM:
      return {...state, currentRoom: action.data.room};
    case Listeners.NEW_LEADER:
      return {...state, currentLeader: action.data.newLeader};
    case Listeners.HOSTAGE_UPDATE:
      return {...state, hostages: action.data.hostages};
    case Listeners.GAME_UPDATE:
      if( state.currentRoom && action.data.rooms ) {
        return {...state, playersInRoom: action.data.rooms[state.currentRoom].players }
      }
      return state;
    default:
      return state;
  }
}
import {User} from "../../domain/User";
import {Listeners} from "../actions/listeners";
import {RoomName} from "../../domain/Room";

export interface RoomState {
  currentRoom: RoomName | undefined,
  currentLeader: User | undefined,
  hostages: User[]
}

const initialState: RoomState = {
  currentRoom: undefined,
  currentLeader: undefined,
  hostages: []
}

export default function roomReducer(state: RoomState = initialState, action: any) {
  switch( action.type ) {
    case Listeners.JOIN_ROOM:
      return {...state, currentRoom: action.data.room};
    default:
      return state;
  }
}
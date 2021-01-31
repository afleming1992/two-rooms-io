import {Listeners} from "../actions/listeners";
import {RoomName} from "../../domain/RoomName";
import Room from "../../domain/Room";

export interface RoomState {
    currentRoom: RoomName | undefined
    reasonForSwitch: string | undefined
    rooms: any | undefined
}

const initialState: RoomState = {
    currentRoom: undefined,
    reasonForSwitch: undefined,
    rooms: {}
}

export default function room(state = initialState, action: any) {
    switch(action.type) {
        case Listeners.GAME_UPDATE:
            return Object.assign( {}, state, { rooms: action.data.rooms });
        case Listeners.JOIN_ROOM:
            return Object.assign( {}, state, { currentRoom: action.data.room });
        default:
            return state;
    }
}
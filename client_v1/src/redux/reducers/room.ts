import {User} from "../../domain/User";
import {Listeners} from "../actions/listeners";

export interface RoomState {
    name: string | undefined
    players: Array<User>
    leader: User | undefined
    hostages: Array<User>
}

const initialState: RoomState = {
    name: undefined,
    players: new Array<User>(),
    leader: undefined,
    hostages: new Array<User>(),
}

export default function room(state = initialState, action: any) {
    switch(action.type) {
        case Listeners.GAME_UPDATE:

        case Listeners.ROOM_UPDATE:

    }
}
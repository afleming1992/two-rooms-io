import {User} from "./User";

export enum RoomName {
    ALPHA = "ALPHA",
    OMEGA = "OMEGA"
}

export default interface Room {
    roomName: RoomName,
    players: User[],
    leader: User,
    hostages: User[]
}
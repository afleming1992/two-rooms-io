import {User} from "./User";

export enum RoomName {
    EAST_WING = "EAST_WING",
    WEST_WING = "WEST_WING"
}

export default interface Room {
  roomName: RoomName,
  players: User[],
  hostages: User[] | undefined,
  leader: User | undefined
}
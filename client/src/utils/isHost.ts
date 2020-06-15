import {User} from "../domain/User";

export const isHost = (player: User, host: User) => {
    return player !== undefined && host !== undefined && player.userToken === host.userToken;
}
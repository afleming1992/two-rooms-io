import {User} from "../domain/User";

export const getPlayerByToken = ( userToken: string | undefined, players: User[] | undefined ) => {
  if ( userToken && players ) {
    return players.find( (player) => player.userToken === userToken );
  } else {
    return undefined;
  }
}
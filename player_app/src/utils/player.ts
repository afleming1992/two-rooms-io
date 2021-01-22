import {User} from "../domain/User";

export const getPlayerByToken = ( userToken: string | undefined, players: User[] | undefined ) => {
  if ( userToken && players ) {
    return players.find( (player) => player.userToken === userToken );
  } else {
    return undefined;
  }
}

export const getPlayerNameInitials = ( name: string ) => {
  return name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
}

export const filterPlayers = (players: User[], excludedUsers: string[] ) => {
  return players.filter((player) => {
    return excludedUsers.indexOf(player.userToken || "") === -1;
  })
}
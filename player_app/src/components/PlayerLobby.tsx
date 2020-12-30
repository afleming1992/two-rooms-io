import React from "react";
import {
  List,
  makeStyles,
} from "@material-ui/core";
import { User } from "../domain/User";
import PlayerListItem from "./PlayerListItem";

interface PlayerLobbyProps {
  players: Array<User>,
  host: User | undefined,
  currentPlayer: string | undefined
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));

const PlayerLobby: React.FC<PlayerLobbyProps> = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {
         props.players.map( ( player ) => {
           return (
              <PlayerListItem player={player} isHost={ player.userToken === props.host?.userToken } isMe={ player.userToken === props.currentPlayer }/>
           );
         })
      }
    </List>
  );
}

export default PlayerLobby;
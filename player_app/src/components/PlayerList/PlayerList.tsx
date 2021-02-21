import React from "react";
import {
  Container,
  List, ListItem,
  makeStyles,
} from "@material-ui/core";
import { User } from "../../domain/User";
import PlayerListItem from "./PlayerListItem";
import {Alert, AlertTitle} from "@material-ui/lab";

interface PlayerListProps {
  players: Array<User> ,
  host?: User | undefined,
  currentPlayer: string | undefined,
  inverse?: boolean
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));

const PlayerList: React.FC<PlayerListProps> = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {
        props.players.map( ( player ) => {
          return (
            <PlayerListItem
              inverse={props.inverse || false}
              player={player}
              isHost={ player.userToken === props.host?.userToken }
              isMe={ player.userToken === props.currentPlayer }/>
          );
        })
      }
    </List>
  );
}

export default PlayerList;
import React from "react";
import {
  Container,
  List,
  makeStyles,
} from "@material-ui/core";
import { User } from "../domain/User";
import PlayerListItem from "./PlayerListItem";

interface PlayerLobbyProps {
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

const PlayerLobby: React.FC<PlayerLobbyProps> = (props) => {
  const classes = useStyles();

  return (
    <Container>
      <List className={classes.root}>
        {
          props.players.map( ( player ) => {
            return (
              <PlayerListItem inverse={props.inverse || false}player={player} isHost={ player.userToken === props.host?.userToken } isMe={ player.userToken === props.currentPlayer }/>
            );
          })
        }
      </List>
    </Container>
  );
}

export default PlayerLobby;
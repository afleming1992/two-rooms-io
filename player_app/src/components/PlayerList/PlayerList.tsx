import React from "react";
import {
  Grid,
  makeStyles,
} from "@material-ui/core";
import { User } from "../../domain/User";
import PlayerListItem from "./PlayerListItem";

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
    <Grid container className={classes.root} spacing={1}>
      {
        props.players.map( ( player ) => {
          return (
            <Grid item xs={12} sm={6} md={4}>
              <PlayerListItem
                inverse={props.inverse || false}
                player={player}
                isHost={ player.userToken === props.host?.userToken }
                isMe={ player.userToken === props.currentPlayer }/>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

export default PlayerList;
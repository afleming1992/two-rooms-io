import React from "react";
import {Box, List, ListItemAvatar, ListItem, Typography, Avatar, makeStyles, ListItemText} from "@material-ui/core";
import { User } from "../domain/User";
import {deepOrange, red} from "@material-ui/core/colors";
import PlayerAvatar from "./PlayerAvatar";

interface PlayerLobbyProps {
  players: Array<User>
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper
  },
  itemText: {
    paddingLeft: theme.spacing(4),
  }
}));

const PlayerLobby: React.FC<PlayerLobbyProps> = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {
         props.players.map( ( player ) => {
           return (
              <ListItem>
                <ListItemAvatar>
                  <PlayerAvatar player={ player } />
                </ListItemAvatar>
                <ListItemText className={classes.itemText} primary={player.name} />
              </ListItem>
           );
         })
      }
    </List>
  );
}

export default PlayerLobby;
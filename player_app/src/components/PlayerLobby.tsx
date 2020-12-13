import React from "react";
import {
  List,
  ListItemAvatar,
  ListItem,
  makeStyles,
  ListItemText,
  Badge, Chip
} from "@material-ui/core";
import { User } from "../domain/User";
import PlayerAvatar from "./PlayerAvatar";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {yellow} from "@material-ui/core/colors";

interface PlayerLobbyProps {
  players: Array<User>,
  host: User | undefined
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper
  },
  itemText: {
    paddingLeft: theme.spacing(4),
  },
  hostChip: {
    backgroundColor: yellow[500],
    color: "#000000"
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
                <ListItemText className={classes.itemText} primary={player.name} secondary={<Chip size="small" className={classes.hostChip} label="Host" icon={<FontAwesomeIcon className={classes.hostChip} icon={faCrown} />} />}/>
              </ListItem>
           );
         })
      }
    </List>
  );
}

export default PlayerLobby;
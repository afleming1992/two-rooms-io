import React from 'react';
import {User} from "../domain/User";
import {ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import {yellow} from "@material-ui/core/colors";
import PlayerAvatar from "./PlayerAvatar";

interface PlayerListItemProps {
    player: User;
    isHost: boolean;
    isMe?: boolean;
}

const useStyles = makeStyles( (theme) => ({
  itemText: {
    paddingLeft: theme.spacing(4),
  },
  hostChip: {
    backgroundColor: yellow[500],
    color: "#000000"
  }
}));

const PlayerListItem : React.FC<PlayerListItemProps> = (props) => {
    const classes = useStyles();

    return (
      <ListItem>
        <ListItemAvatar>
            <PlayerAvatar player={ props.player } isHost={ props.isHost }/>
        </ListItemAvatar>
        <ListItemText className={classes.itemText} primary={ props.player.name } secondary={ props.isMe ? "(You)" : "" } />
      </ListItem>
    );
}

export default PlayerListItem;
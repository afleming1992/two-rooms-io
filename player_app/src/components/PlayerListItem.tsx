import React from 'react';
import {User} from "../domain/User";
import {Chip, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {yellow} from "@material-ui/core/colors";
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import PlayerAvatar from "./PlayerAvatar";

interface PlayerListItemProps {
    player: User;
    isHost: boolean;
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

    const hostBadge = props.isHost ? <Chip size="small" className={classes.hostChip} label="Host" icon={<FontAwesomeIcon className={classes.hostChip} icon={faCrown} />} /> : <></>;

    return (
      <ListItem>
        <ListItemAvatar>
          <PlayerAvatar player={ props.player } />
        </ListItemAvatar>
        <ListItemText className={classes.itemText} primary={ props.player.name} secondary={ hostBadge } />
      </ListItem>
    );
}

export default PlayerListItem;
import React from "react";
import {User} from "../domain/User";
import {Avatar, makeStyles, Theme} from "@material-ui/core";
import {lime} from "@material-ui/core/colors";

interface PlayerAvatarProps {
  player: User
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: lime[600],
    width: theme.spacing(8),
    height: theme.spacing(8)
  }
}));

const PlayerAvatar: React.FC<PlayerAvatarProps> = (props) => {
  const classes = useStyles();


  return (
    <Avatar className={classes.root} src="/broken-image.png" alt={props.player.name} />
  );

}

export default PlayerAvatar;
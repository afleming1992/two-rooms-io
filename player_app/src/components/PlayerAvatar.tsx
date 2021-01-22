import React from "react";
import {User} from "../domain/User";
import {Avatar, Badge, createStyles, makeStyles, Theme, withStyles} from "@material-ui/core";
import {lime, yellow} from "@material-ui/core/colors";
import { faCrown, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import {getPlayerNameInitials} from "../utils/player";

interface PlayerAvatarProps {
  player: User | undefined,
  isHost?: boolean,
  size?: "small" | "normal"
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: lime[600],
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  small: {
    width: 30,
    height: 30
  }
}));

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({player, isHost = false, size = "normal"}) => {
  const classes = useStyles();

  let avatarClasses = classes.root;
  if ( size === "small" ) {
    avatarClasses = classNames(classes.root, classes.small)
  }

  if( player ) {
    return <Avatar className={avatarClasses}>{ player.name ? getPlayerNameInitials(player.name) : "?" }</Avatar>
  } else {
    return <Avatar className={avatarClasses}><FontAwesomeIcon icon={faQuestion} /></Avatar>
  }
}


export default PlayerAvatar;
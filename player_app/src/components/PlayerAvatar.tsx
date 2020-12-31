import React from "react";
import {User} from "../domain/User";
import {Avatar, Badge, makeStyles, Theme} from "@material-ui/core";
import {lime, yellow} from "@material-ui/core/colors";
import { faCrown, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PlayerAvatarProps {
  player: User | undefined,
  isHost: boolean
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: lime[600],
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

const PlayerAvatar: React.FC<PlayerAvatarProps> = (props) => {
  const classes = useStyles();

  let avatar = <Avatar className={classes.root}><FontAwesomeIcon icon={faQuestion} /></Avatar>
  if( props.player ) {
    avatar = <Avatar className={classes.root} src="/broken-image.png" alt={props.player.name} />
  }

  return (
    <Badge color="primary" overlap="circle" invisible={!props.isHost} badgeContent={<FontAwesomeIcon icon={faCrown} />}>
      { avatar }
    </Badge>
  );

}

export default PlayerAvatar;
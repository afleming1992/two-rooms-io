import React from 'react';
import {CardShareType} from "../domain/Sharing";
import {Card} from "../domain/Card";
import {Avatar, Badge, createStyles, makeStyles, Theme, withStyles} from "@material-ui/core";
import {getTeamDetails, Team} from "../domain/Team";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import {User} from "../domain/User";
import PlayerAvatar  from "./PlayerAvatar";

interface CardShareTypeAvatarProps {
  card: Card
  type: CardShareType | undefined
  player?: User | undefined
}

const useStyles = makeStyles((theme) => ({
  root: (props : CardShareTypeAvatarProps) => {
    return {
      backgroundColor: getTeamDetails(props.card.team).color,
      height: theme.spacing(7),
      width: theme.spacing(7),
    }
  }
}));



const CardShareTypeAvatar: React.FC<CardShareTypeAvatarProps> = (props) => {
  const classes = useStyles(props);

  let avatar;

  switch( props.type ) {
    case CardShareType.ROLE:
      avatar = <Avatar className={classes.root} src={`role/${props.card.cardImage}.png`} />
      break;
    case CardShareType.COLOUR:
      avatar = <Avatar className={classes.root} />
      break;
    default:
      avatar = <Avatar className={classes.root}><FontAwesomeIcon icon={faQuestion} /></Avatar>
      break;
  }

  if ( props.player ) {
    return (
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        badgeContent={<PlayerAvatar size={"small"} player={props.player} />}>
        { avatar }
      </Badge>
    )
  } else {
    return avatar;
  }
}

export default CardShareTypeAvatar;
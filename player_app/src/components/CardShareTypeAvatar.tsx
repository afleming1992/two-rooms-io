import React from 'react';
import {CardShareType} from "../domain/Sharing";
import {Card} from "../domain/Card";
import {Avatar, makeStyles} from "@material-ui/core";
import {getTeamDetails, Team} from "../domain/Team";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

interface CardShareTypeAvatarProps {
  card: Card
  type: CardShareType | undefined
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

  switch( props.type ) {
    case CardShareType.ROLE:
      return <Avatar className={classes.root} src={`role/${props.card.cardImage}.png`} />
    case CardShareType.COLOUR:
      return <Avatar className={classes.root} />
    default:
      return <Avatar className={classes.root}><FontAwesomeIcon icon={faQuestion} /></Avatar>
  }
}

export default CardShareTypeAvatar;
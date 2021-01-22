import React from 'react';
import {EventType} from "../../../domain/GameEvent";
import {User} from "../../../domain/User";
import {faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import TimelineEvent from "../ TimelineEvent";
import {useDispatch} from "react-redux";
import {doReveal} from "../../../redux/actions/revealCreators";
import {Button, makeStyles} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {dismissEvent} from "../../../redux/actions/gameActionCreators";

interface RevealEventProps {
  id: string | undefined
  lastUpdate?: Date | undefined,
  type: EventType,
  requestor: User | undefined,
  viewed: boolean
}

const useStyles = makeStyles((theme) => ({
  viewed: {
    color: "green"
  }
}));

const RevealEvent: React.FC<RevealEventProps> = ({id, lastUpdate, type, requestor, viewed}) => {
  const classes = useStyles();

  let title: string = "";
  const dispatch = useDispatch();

  const onRevealClick = () => {
    dispatch(doReveal(id || "" ) );
  }

  const onDismissClick = () => {
    dispatch(dismissEvent(id || ""));
  }

  const actionButtons = () => {
    if( !viewed ) {
      return <>
        <Button onClick={() => onRevealClick()}>Reveal</Button>
      </>
    } else {
      return <>
        <span className={classes.viewed}><FontAwesomeIcon icon={faCheck} /> Viewed</span>
        <Button onClick={() => onDismissClick()}>Dismiss</Button>
      </>
    }
  }

  switch(type) {
    case EventType.COLOUR_REVEAL:
      title = `${requestor?.name} has revealed their colour to you`;
      break;
    case EventType.ROLE_REVEAL:
      title = `${requestor?.name} has revealed their role to you`;
  }

  return (
    <TimelineEvent text={title} timelineIcon={faEye} lastUpdate={lastUpdate} actionButtons={actionButtons()}/>
  );
}

export default RevealEvent;
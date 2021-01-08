import React from 'react';
import GameEvent, {EventType} from "../../domain/GameEvent";
import {Card} from "@material-ui/core";
import ShareEvent from "./ShareEvent";
import {User} from "../../domain/User";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import TimelineEvent from "./ TimelineEvent";

interface RevealEventProps {
  id: string | undefined
  lastUpdate?: Date | undefined,
  type: EventType,
  requestor: User | undefined
}

const RevealEvent: React.FC<RevealEventProps> = ({lastUpdate, type, requestor}) => {
  let title: string = "";

  switch(type) {
    case EventType.COLOUR_REVEAL:
      title = `${requestor?.name} has revealed their colour to you`;
      break;
    case EventType.ROLE_SHARE:
      title = `${requestor?.name} has revealed their role to you`;
  }

  return (
    <TimelineEvent text={title} timelineIcon={faEye} lastUpdate={lastUpdate} />
  );
}

export default RevealEvent;
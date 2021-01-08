import React from 'react';
import {User} from "../../domain/User";
import {EventType} from "../../domain/GameEvent";
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import TimelineEvent from "./ TimelineEvent";

interface ShareEventProps {
  id: string | undefined
  lastUpdate?: Date | undefined,
  type: EventType
  requestor: User | undefined,
  recipient: User | undefined,
  isCurrentPlayerRequestor: boolean
}

const ShareEvent: React.FC<ShareEventProps> = ({isCurrentPlayerRequestor, requestor, recipient, ...props}) => {
  let title: string = "";

  switch(props.type) {
    case EventType.COLOUR_SHARE:
      if ( isCurrentPlayerRequestor ) {
        title = `Requested Colour Share with ${recipient?.name}`;
      } else {
        title = `${requestor?.name} would like to share colours`;
      }
      break;
    case EventType.ROLE_SHARE:
      if ( isCurrentPlayerRequestor ) {
        title = `Requested Role Share with ${recipient?.name}`;
      } else {
        title = `${requestor?.name} would like to share roles`;
      }
      break;
  }

  return (
    <TimelineEvent text={title} timelineIcon={faExchangeAlt} lastUpdate={props.lastUpdate} />
  );
}

export default ShareEvent;
import React, {ReactNode} from 'react';
import {EventType} from "../../../domain/GameEvent";
import {User} from "../../../domain/User";
import {RequestResponse} from "../../../domain/RequestResponse";
import TimelineEvent from "../ TimelineEvent";
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {useDispatch} from "react-redux";
import {Button} from "@material-ui/core";
import {doReveal} from "../../../redux/actions/revealCreators";
import {dismissEvent} from "../../../redux/actions/gameActionCreators";

interface RequestedShareEventProps {
  id: string | undefined,
  lastUpdate: Date,
  type: EventType,
  recipient: User | undefined,
  responded: boolean,
  recipientResponse: RequestResponse,
  revealViewed: boolean
}

interface EventProps {
  title: string,
  actionButtons: ReactNode
}

const RequestedShareEvent: React.FC<RequestedShareEventProps> = (props) => {
  const dispatch = useDispatch();
  const {id, responded, recipient, recipientResponse, revealViewed, lastUpdate} = props;

  const emptyActions = (
    <></>
  )

  const revealButton = (
    <><Button onClick={() => dispatch(doReveal(id || ""))}>Reveal</Button></>
  )

  const dismissButton = (
    <><Button onClick={() => dispatch(dismissEvent(id || ""))}>Dismiss</Button></>
  )

  let eventProps: EventProps = {
    title: "",
    actionButtons: emptyActions
  }

  const renderResponded = (type: string) => {
    if (recipientResponse === RequestResponse.ACCEPTED) {
      const title = `${recipient?.name} accepted your ${type}`
      if (!revealViewed) {
        return {
          title,
          actionButtons: revealButton
        }
      } else {
        return {
          title,
          actionButtons: dismissButton
        }
      }
    } else {
      return {
        title: `${recipient?.name} declined your ${type}`,
        actionButtons: dismissButton
      }
    }
  }

  switch(props.type) {
    case EventType.COLOUR_SHARE:
      if (responded) {
        eventProps = renderResponded("your Colour Share Request")
      } else {
        eventProps.title = `Requested colour share with ${recipient?.name}`
      }
      break;
    case EventType.ROLE_SHARE:
      if( responded ) {
        eventProps = renderResponded("your Role Share Request")
      } else {
        eventProps.title = `Requested role share with ${recipient?.name}`
      }
      break;
  }

  return (
    <TimelineEvent text={eventProps.title} timelineIcon={faExchangeAlt} lastUpdate={lastUpdate} actionButtons={eventProps.actionButtons} />
  );
}

export default RequestedShareEvent;
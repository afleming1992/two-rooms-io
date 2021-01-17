import React, {ReactNode} from 'react';
import {User} from "../../../domain/User";
import {EventType} from "../../../domain/GameEvent";
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import TimelineEvent from "../ TimelineEvent";
import {RequestResponse} from "../../../domain/RequestResponse";
import {Button} from "@material-ui/core";
import {acceptShare, dismissEvent, rejectShare} from "../../../redux/actions/gameActionCreators";
import {useDispatch} from "react-redux";
import {doReveal} from "../../../redux/actions/revealCreators";

interface ReceivedShareEvent {
  id: string | undefined
  lastUpdate?: Date | undefined,
  type: EventType,
  requestor: User | undefined,
  recipientResponse: RequestResponse,
  responded: boolean,
  revealViewed: boolean
}

interface EventProps {
  title: string,
  actionButtons: ReactNode
}

const ReceivedShareEvent: React.FC<ReceivedShareEvent> = (props) => {
  const dispatch = useDispatch();
  const {id, responded, requestor, recipientResponse, revealViewed, lastUpdate} = props;

  const emptyActions = (
    <></>
  );

  const requestResponseButtons = (
    <>
      <Button onClick={() => dispatch(acceptShare(id || "" ))}>Accept</Button>
      <Button onClick={() => dispatch(rejectShare( id || "" ))}>Reject</Button>
    </>
  );

  const revealButton = (
    <>
      <Button onClick={() => dispatch(doReveal(id || ""))}>Reveal</Button>
    </>
  );

  const dismissButton = (
    <>
      <Button onClick={() => dispatch(dismissEvent(id || ""))}>Dismiss</Button>
    </>
  );

  let eventProps: EventProps = {
    title: "",
    actionButtons: emptyActions
  }

  const renderedResponded = (type: string) => {
    if (recipientResponse === RequestResponse.ACCEPTED) {
      const title = `You accepted ${requestor?.name}'s ${type}`
      if( !revealViewed ) {
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
        title: `You declined ${requestor?.name}'s ${type}`,
        actionButtons: dismissButton
      }
    }
  }

  switch(props.type) {
    case EventType.COLOUR_SHARE:
      if ( responded ) {
        eventProps = renderedResponded("Colour Share Request");
      } else {
        eventProps.title = `${props.requestor?.name} would like to share colours`;
        eventProps.actionButtons = requestResponseButtons;
      }
      break;
    case EventType.ROLE_SHARE:
      if ( responded ) {
        eventProps = renderedResponded("Role Share Request");
      } else {
        eventProps.title = `${props.requestor?.name} would like to share roles`;
        eventProps.actionButtons = requestResponseButtons;
      }
      break;
  }

  return (
    <TimelineEvent text={eventProps.title} timelineIcon={faExchangeAlt} lastUpdate={lastUpdate} actionButtons={eventProps.actionButtons}/>
  );
};

export default ReceivedShareEvent;
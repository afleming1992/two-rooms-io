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

const ReceivedShareEvent: React.FC<ReceivedShareEvent> = (props) => {
  let title: string = "";
  let actionButtons: ReactNode;
  const dispatch = useDispatch();

  const requestResponseButtons = () => {
    return (
      <>
        <Button onClick={() => dispatch(acceptShare(props.id || "" ))}>Accept</Button>
        <Button onClick={() => dispatch(rejectShare( props.id || "" ))}>Reject</Button>
      </>
    );
  }

  const revealButton = () => {
    return (
      <>
        <Button onClick={() => dispatch(doReveal(props.id || ""))}>Reveal</Button>
      </>
    )
  }

  const dismissButtons = () => {
    return (
      <>
        <Button onClick={() => dispatch(dismissEvent(props.id || ""))}>Dismiss</Button>
      </>
    );
  }

  switch(props.type) {
    case EventType.COLOUR_SHARE:
      if ( props.responded ) {
        if ( props.recipientResponse === RequestResponse.ACCEPTED ) {
          title = `You accepted ${props.requestor?.name}'s Colour Share request`
          if( !props.revealViewed ) {
            actionButtons = revealButton();
          } else {
            actionButtons = dismissButtons();
          }
        } else if (props.recipientResponse === RequestResponse.DECLINED ) {
          title = `You declined ${props.requestor?.name}'s Colour Share request`
          actionButtons = dismissButtons();
        }
      } else {
        title = `${props.requestor?.name} would like to share colours`;
        actionButtons = requestResponseButtons();
      }
      break;
    case EventType.ROLE_SHARE:
      if ( props.responded ) {
        if ( props.recipientResponse === RequestResponse.ACCEPTED ) {
          title = `You accepted ${props.requestor?.name}'s Role Share request`
          if( !props.revealViewed ) {
            actionButtons = revealButton();
          } else {
            actionButtons = dismissButtons();
          }
        } else if (props.recipientResponse === RequestResponse.DECLINED ) {
          title = `You declined ${props.requestor?.name}'s Role Share request`
          actionButtons = dismissButtons();
        }
      } else {
        title = `${props.requestor?.name} would like to share roles`;
        actionButtons = requestResponseButtons();
      }
      break;
  }

  return (
    <TimelineEvent text={title} timelineIcon={faExchangeAlt} lastUpdate={props.lastUpdate} actionButtons={actionButtons}/>
  );
};

export default ReceivedShareEvent;
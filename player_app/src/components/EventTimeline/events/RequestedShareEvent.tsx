import React from 'react';
import {EventType} from "../../../domain/GameEvent";
import {User} from "../../../domain/User";
import {RequestResponse} from "../../../domain/RequestResponse";

interface RequestedShareEventProps {
  id: string | undefined,
  lastUpdate: Date,
  type: EventType,
  recipient: User | undefined,
  responded: boolean,
  recipientResponse: RequestResponse,
  revealViewed: boolean
}

const RequestedShareEvent: React.FC<RequestedShareEventProps> = (props) => {
  return (
    <></>
  );
}

export default RequestedShareEvent;
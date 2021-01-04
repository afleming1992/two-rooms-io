import React from 'react';
import {Card, CardActions, CardHeader, IconButton, makeStyles} from "@material-ui/core";
import PlayerAvatar from "../PlayerAvatar";
import {User} from "../../domain/User";
import {EventType} from "../../domain/GameEvent";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ShareEventProps {
  type: EventType
  requestor: User | undefined,
  recipient: User | undefined,
  isCurrentPlayerRequestor: boolean
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345
  },
}));

const ShareEvent: React.FC<ShareEventProps> = ({isCurrentPlayerRequestor, requestor, recipient, ...props}) => {
  const classes = useStyles();

  let title: string = "";
  let subtitle: string = "";

  switch(props.type) {
    case EventType.COLOUR_SHARE:
      if ( isCurrentPlayerRequestor ) {
        title = `Requested Colour Share with ${recipient?.name}`;
        subtitle = `Awaiting Response`;
      } else {
        title = `${requestor?.name} would like to share colours`;
        subtitle = `Awaiting Response`;
      }
      break;
    case EventType.ROLE_SHARE:
      if ( isCurrentPlayerRequestor ) {
        title = `Requested Role Share with ${recipient?.name}`;
        subtitle = `Awaiting Response`;
      } else {
        title = `${requestor?.name} would like to share roles`;
        subtitle = `Awaiting Response`;
      }
      break;
  }

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={subtitle}
        avatar={<PlayerAvatar player={ isCurrentPlayerRequestor ? recipient: requestor } isHost={false} />} />
      <CardActions>
        <IconButton>
          <FontAwesomeIcon icon={faCheck} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ShareEvent;
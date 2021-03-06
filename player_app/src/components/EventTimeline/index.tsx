import React from 'react';
import {connect} from "react-redux";
import {Box, Button, makeStyles, Paper, Typography} from "@material-ui/core";
import GameEvent, {EventType} from "../../domain/GameEvent";
import {AppState} from "../../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import {User} from "../../domain/User";
import {
  Alert,
  Timeline,
} from "@material-ui/lab";
import RevealEvent from "./events/RevealEvent";
import RequestedShareEvent from "./events/RequestedShareEvent";
import ReceivedShareEvent from "./events/ReceivedShareEvent";

interface EventTimelineProps {
  timeline: Array<GameEvent>,
  currentPlayerToken: string,
  players: User[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.down('md'),
    margin: theme.spacing(1),
    marginBottom: "50px"
  },
  headingContainer: {
    padding: theme.spacing(3),
    paddingBottom: 0,
  }
}));

const EventTimeline: React.FC<EventTimelineProps> = (props) => {
  const classes = useStyles();

  const getPlayerByToken = ( userToken: string | undefined ) => {
    if ( userToken ) {
      return props.players.find( (player) => player.userToken === userToken );
    } else {
      return undefined;
    }
  }

  const buildEventCard = (event: GameEvent) => {
    switch(event.type) {
      case EventType.COLOUR_SHARE:
      case EventType.ROLE_SHARE:
        if ( event.requestor === props.currentPlayerToken ) {
          return (
            <RequestedShareEvent
            id={event.id}
            lastUpdate={event.lastUpdated}
            type={event.type}
            recipient={getPlayerByToken( event.recipient )}
            responded={event.responded}
            recipientResponse={event.recipientResponse}
            revealViewed={event.revealViewed} />);
        } else {
          return (
            <ReceivedShareEvent
            id={event.id}
            lastUpdate={event.lastUpdated}
            type={event.type}
            requestor={getPlayerByToken(event.requestor)}
            responded={event.responded}
            recipientResponse={event.recipientResponse}
            revealViewed={event.revealViewed} />
          );
        }
      case EventType.ROLE_REVEAL:
      case EventType.COLOUR_REVEAL:
        return (
          <RevealEvent
            id={event.id}
            lastUpdate={event.lastUpdated}
            type={event.type}
            requestor={getPlayerByToken( event.requestor )}
            viewed={event.revealViewed}
          />
        )
    }
  }

  props.timeline.sort((a,b) => {
    return b.lastUpdated.getTime() - a.lastUpdated.getTime();
  });

  return (
    <>
      <Box className={classes.headingContainer}>
        <Typography variant="h6">Events</Typography>
      </Box>
      <Timeline align="left">
        {
          props.timeline.length === 0 &&
          <Alert severity="info">
            No Events in Timeline
          </Alert>
        }
        {
          props.timeline.map((event) => (
            buildEventCard(event)
          ))
        }
      </Timeline>
    </>
  );
}

const mapStateToProps = (state: AppState) => {
    return {
        timeline: state.events.timeline,
        currentPlayerToken: state.player.userToken || "",
        players: state.game.players || []
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({

  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventTimeline);
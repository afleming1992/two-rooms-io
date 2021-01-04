import React from 'react';
import {connect} from "react-redux";
import {Box, Button, makeStyles, Paper, styled, Typography} from "@material-ui/core";
import GameEvent, {EventType} from "../../domain/GameEvent";
import {AppState} from "../../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import ShareEvent from "./ShareEvent";
import {User} from "../../domain/User";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem, TimelineOppositeContent,
  TimelineSeparator
} from "@material-ui/lab";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faExchangeAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

interface EventTimelineProps {
  timeline: Array<GameEvent>,
  currentPlayerToken: string,
  players: User[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.down('md'),
    margin: theme.spacing(1)
  },
  headingContainer: {
    padding: theme.spacing(3),
    paddingBottom: 0,
  },
  paper: {
    display: 'flex',
    alignItems: "flex-start",
    flexWrap: 'wrap',
    padding: '6px 16px'
  },
  mainText: {
    order: 1,
    width: '100%'
  },
  minutesAgo: {
    flexGrow: 1,
    order: 2,
    paddingTop: theme.spacing(1)
  },
  actionButtons: {
    flexGrow: 4,
    order: 3,
    width: "auto",
    alignSelf: "right",
    textAlign: 'right'
  }
}));

const LeftTimelineItem = styled(TimelineItem)({
  "&::before": {
    flex: 0
  }
});

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
        return (
          <ShareEvent
            type={event.type}
            isCurrentPlayerRequestor={ event.requestor === props.currentPlayerToken }
            recipient={getPlayerByToken( event.recipient )}
            requestor={getPlayerByToken( event.requestor )}
          />
        );
      case EventType.ROLE_REVEAL:
      case EventType.COLOUR_REVEAL:
        return (
          <></>
        )
    }
  }

  return (
    <>
      <Box className={classes.headingContainer}>
        <Typography variant="h6">Important Events</Typography>
      </Box>
      <Box className={classes.headingContainer}>
        <Typography variant="h6">Events</Typography>
      </Box>
      <Timeline align="left">
        {
          props.timeline.map((event) => (
            <LeftTimelineItem>
              <TimelineSeparator>
                <TimelineDot variant="outlined">
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                  <Typography className={classes.mainText} variant="subtitle1">Andrew has requested to see your colour</Typography>
                  <Typography className={classes.minutesAgo} variant="subtitle2">2m ago</Typography>
                  <div className={classes.actionButtons}>
                    <Button startIcon={<FontAwesomeIcon icon={faCheck} size="xs" />}>Accept</Button>
                    <Button startIcon={<FontAwesomeIcon icon={faTimes} size="xs" />}>Decline</Button>
                  </div>
                </Paper>
              </TimelineContent>
            </LeftTimelineItem>
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
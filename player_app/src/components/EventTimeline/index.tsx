import React from 'react';
import {connect} from "react-redux";
import {Box, Typography} from "@material-ui/core";
import GameEvent, {EventType} from "../../domain/GameEvent";
import {AppState} from "../../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import ShareEvent from "./ShareEvent";
import RevealEvent from "./RevealEvent";

interface EventTimelineProps {
  timeline: Array<GameEvent>
}



const EventTimeline: React.FC<EventTimelineProps> = (props) => {
  const buildEventCard = (event: GameEvent) => {
    switch(event.type) {
      case EventType.COLOUR_SHARE:
      case EventType.ROLE_SHARE:
        return (
          <ShareEvent event={event} />
        );
      case EventType.ROLE_REVEAL:
      case EventType.COLOUR_REVEAL:
        return (
          <RevealEvent event={event} />
        )
    }
  }

  return (
    <Box>
      {
        props.timeline.map( (event) => buildEventCard(event))
      }
    </Box>
  );
}

const mapStateToProps = (state: AppState) => {
    return {
        timeline: state.events.timeline
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({

  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventTimeline);
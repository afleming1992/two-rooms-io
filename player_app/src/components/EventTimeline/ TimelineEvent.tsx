import React from 'react';
import {Button, makeStyles, Paper, styled, Typography} from "@material-ui/core";
import {TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@material-ui/lab";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faExchangeAlt, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface TimelineEventProps {
  text: string
  timelineIcon: IconDefinition
  lastUpdate?: Date | undefined
}

const useStyles = makeStyles((theme) => ({
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
  },
});

const TimelineEvent: React.FC<TimelineEventProps> = (props) => {
  const classes = useStyles();

  let lastUpdate = "";
  if( props.lastUpdate ) {
    let diff = Math.round( (new Date().getTime() - props.lastUpdate.getTime()) / 1000 );
    if ( diff < 10 ) {
      lastUpdate = "Now";
    } else if ( diff < 30 ) {
      lastUpdate = "30s ago"
    } else if ( diff < 60 ) {
      lastUpdate = "60s ago"
    } else {
      lastUpdate = `${Math.floor(diff / 60)}m ago`
    }
  }

  return (
    <LeftTimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined">
          <FontAwesomeIcon icon={props.timelineIcon} />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.mainText} variant="subtitle1">{ props.text }</Typography>
          <Typography className={classes.minutesAgo} variant="subtitle2">{ lastUpdate }</Typography>
          <div className={classes.actionButtons}>
            <Button startIcon={<FontAwesomeIcon icon={faCheck} size="xs" />}>Accept</Button>
            <Button startIcon={<FontAwesomeIcon icon={faTimes} size="xs" />}>Decline</Button>
          </div>
        </Paper>
      </TimelineContent>
    </LeftTimelineItem>
  );
}

export default TimelineEvent
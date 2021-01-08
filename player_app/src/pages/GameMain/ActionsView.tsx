import React from 'react';
import {Container, makeStyles} from "@material-ui/core";
import EventTimeline from "../../components/EventTimeline";

interface ActionsViewProps {
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "60px"
  }
}));

const ActionsView: React.FC<ActionsViewProps> = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} disableGutters>
      <EventTimeline />
    </Container>
  );
}


export default ActionsView;
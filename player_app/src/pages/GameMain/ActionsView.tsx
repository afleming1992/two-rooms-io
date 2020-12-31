import React from 'react';
import {Container} from "@material-ui/core";
import EventTimeline from "../../components/EventTimeline";

interface ActionsViewProps {
}

const ActionsView: React.FC<ActionsViewProps> = (props) => {
  return (
    <Container>
      <EventTimeline />
    </Container>
  );
}


export default ActionsView;
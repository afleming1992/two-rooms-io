import React from "react";
import {Header, Icon, Segment, Step} from "semantic-ui-react";
import Round from "../../../domain/Round";
import {Simulate} from "react-dom/test-utils";

interface RoundTrackerProps {
    currentRound: number | undefined,
    roundData: Array<Round> | undefined
}

const RoundTracker = ({currentRound, roundData} : RoundTrackerProps) => {
    let text = `Round ${ currentRound } / ${ roundData?.length }`
    if ( currentRound == roundData?.length ) {
        text = "FINAL ROUND";
    }

    if( currentRound != null && roundData != null ) {
        return (
          <Segment textAlign="center">
              <Header size="huge">{ text }</Header>
          </Segment>
        );
    } else {
        return <Segment loading />
    }
}

export default RoundTracker;
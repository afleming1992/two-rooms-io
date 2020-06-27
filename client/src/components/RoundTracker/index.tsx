import React from "react";
import {Icon, Segment, Step} from "semantic-ui-react";
import Round from "../../domain/Round";
import {Simulate} from "react-dom/test-utils";

interface RoundTrackerProps {
    currentRound: number | undefined,
    roundData: Array<Round> | undefined
}

const RoundTracker = ({currentRound, roundData} : RoundTrackerProps) => {
    if( currentRound != null && roundData != null ) {
        return (
          <Step.Group fluid>
              {
                  roundData.map(
                      round => {
                          return (
                              <Step active={currentRound === round.roundNumber} completed={currentRound > round.roundNumber}>
                                  <Icon name="circle outline" />
                                  <Step.Content>
                                      <Step.Title>Round { round.roundNumber }</Step.Title>
                                      <Step.Description>{round.hostagesRequired} Hostages Required</Step.Description>
                                  </Step.Content>
                              </Step>
                          );
                      })
              }
          </Step.Group>
        );
    } else {
        return <></>;
    }
}

export default RoundTracker;
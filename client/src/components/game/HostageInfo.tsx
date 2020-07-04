import React from 'react';
import {Header, Segment} from "semantic-ui-react";
import Round from "../../domain/Round";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPeopleArrows} from "@fortawesome/free-solid-svg-icons";

interface HostageInfoProps {
    currentRound: number | undefined,
    roundData: Array<Round> | undefined
}

const HostageInfo = ({currentRound, roundData}: HostageInfoProps) => {
    return (
        <Segment loading={ currentRound == undefined || roundData == undefined } textAlign="center">
            {roundData !== undefined && currentRound !== undefined && currentRound <= roundData.length &&
                <Header size="huge"><FontAwesomeIcon icon={faPeopleArrows} /> {roundData[currentRound - 1].hostagesRequired} Hostage</Header>
            }
        </Segment>
    );
}

export default HostageInfo;
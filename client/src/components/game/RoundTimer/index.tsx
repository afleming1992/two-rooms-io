import React, {ReactNode} from 'react';
import {Header, Progress, Segment, SegmentGroup} from "semantic-ui-react";
import {TimerState} from "../../../redux/reducers/timer";
import './index.css'
import {SemanticCOLORS} from "semantic-ui-react/dist/commonjs/generic";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faClock,
    faExclamation,
    faGripLinesVertical,
    faPause,
    faPeopleArrows,
    faPlay
} from "@fortawesome/free-solid-svg-icons";

interface RoundTimerProps {
    timer: TimerState
}

enum TimerMode {
    RUNNING,
    WARNING,
    PAUSED,
    ENDED,
}

const RoundTimer = ({timer, ...props}: RoundTimerProps) => {
    const minutes: number = Math.floor(timer.secondsLeft / 60);
    const seconds: number = timer.secondsLeft % 60;

    let timerMode = TimerMode.PAUSED;
    if( timer.timerRunning ) {
        timerMode = TimerMode.RUNNING;
    }

    if (timer.secondsLeft < 30 && timer.timerRunning) {
        timerMode = TimerMode.WARNING;
    }

    if (timer.secondsLeft == 0) {
        timerMode = TimerMode.ENDED;
    }

    const timerContents: ReactNode = <>
        <h1 className='timer-clock'>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</h1>
    </>

    let timerBlock;
    switch(timerMode) {
        case TimerMode.RUNNING:
            timerBlock = <Segment compact inverted color="green" textAlign="center">{timerContents}</Segment>
            break;
        case TimerMode.WARNING:
            timerBlock = <Segment compact inverted color="red" textAlign="center">{timerContents}</Segment>
            break;
        case TimerMode.ENDED:
            timerBlock = <Segment compact inverted color="black" textAlign="center"><h1 className="timer-clock">TIME UP!!!</h1></Segment>
            break;
        default:
            timerBlock = <Segment compact textAlign="center">{timerContents}</Segment>
            break;
    }

    return <SegmentGroup>
        <Segment compact inverted textAlign="center">
            <h2>Round 1 <FontAwesomeIcon icon={faGripLinesVertical} /> 2 <FontAwesomeIcon icon={faPeopleArrows} /></h2>
        </Segment>
        { timerBlock }
    </SegmentGroup>
}

export default RoundTimer;
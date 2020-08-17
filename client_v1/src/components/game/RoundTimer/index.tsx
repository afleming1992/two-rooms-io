import React, {ReactNode} from 'react';
import {Header, Progress, Segment} from "semantic-ui-react";
import {TimerState} from "../../../redux/reducers/timer";
import './index.css'
import {SemanticCOLORS} from "semantic-ui-react/dist/commonjs/generic";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faExclamation, faPause, faPlay} from "@fortawesome/free-solid-svg-icons";

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
        <Header size="huge" className="no-margin-bottom"><FontAwesomeIcon icon={faClock}/>&nbsp;&nbsp;{minutes}:{seconds < 10 ? "0" + seconds : seconds}</Header>
    </>

    switch(timerMode) {
        case TimerMode.RUNNING:
            return <Segment inverted color="green" textAlign="center">{timerContents}</Segment>
        case TimerMode.WARNING:
            return <Segment inverted color="red" textAlign="center">{timerContents}</Segment>
        case TimerMode.ENDED:
            return <Segment inverted color="black" textAlign="center"><Header size="huge">TIME UP!!!</Header></Segment>
        default:
            return <Segment textAlign="center">{timerContents}</Segment>
    }
}

export default RoundTimer;
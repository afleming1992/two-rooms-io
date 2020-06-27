import React, {ReactNode} from 'react';
import {Progress, Segment} from "semantic-ui-react";
import {TimerState} from "../../redux/reducers/timer";
import './index.css'

interface RoundTimerProps {
    timer: TimerState
}

const RoundTimer = ({timer, ...props}: RoundTimerProps) => {
    const minutes: number = Math.floor(timer.secondsLeft / 60);
    const seconds: number = timer.secondsLeft % 60;

    let timerWarning = false;
    if (timer.secondsLeft < 30) {
        timerWarning = true;
    }

    const timerContents: ReactNode = <>
        <Progress className="timer-progress" indicating={timer.timerRunning}
                                                 error={timer.secondsLeft == 0}
                                                 value={timer.secondsLeft == 0 ? timer.initialTime : timer.secondsLeft}
                                                 total={timer.initialTime}/>
        <div className="timer-text">{minutes}:{seconds < 10 ? "0" + seconds : seconds}</div>
    </>

    return timerWarning ? <Segment textAlign="center" inverted color={"red"}>{ timerContents }</Segment> : <Segment textAlign="center">{ timerContents }</Segment>;
}

export default RoundTimer;
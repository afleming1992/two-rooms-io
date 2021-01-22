import React from 'react';
import {Chip, makeStyles} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import {TimerState} from "../../redux/reducers/timer";
import {AppState} from "../../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {green, red} from "@material-ui/core/colors";
import actionCreators from "../../redux/actions/gameActionCreators"

interface GameTimerProps {
  timer: TimerState,
  startTimer: any,
  pauseTimer: any,
  isHost: boolean
}

const useStyles = makeStyles((theme) => ({
  running: {
    fontSize: "1em",
    backgroundColor: green[500]
  },
  warning: {
    fontSize: "1em",
    backgroundColor: red[700]
  },
  ended: {
    fontSize: "1em",
    backgroundColor: "#000000"
  },
  paused: {
    fontSize: "1em",
    backgroundColor: theme.palette.primary.dark
  }
}));

const GameTimer: React.FC<GameTimerProps> = ({timer, ...props}) => {
  const classes = useStyles();

  const minutes: number = Math.floor( timer.secondsLeft / 60);
  const seconds: number = timer.secondsLeft % 60;

  let label = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  let timerClickAction = props.startTimer;
  let timerDisplay = classes.paused;

  if( timer.timerRunning ) {
    timerClickAction = props.pauseTimer
    timerDisplay = classes.running;
  }

  if ( timer.secondsLeft < 30 && timer.timerRunning ) {
    timerClickAction = props.pauseTimer
    timerDisplay = classes.warning;
  }

  if ( timer.secondsLeft === 0 ) {
    timerClickAction = () => {}
    timerDisplay = classes.ended
    label = "TIMES UP!!!";
  }

  return (
    <Chip clickable onClick={ props.isHost ? timerClickAction : () => {} } className={timerDisplay} size="medium" icon={<FontAwesomeIcon icon={faClock} size="2x" />} label={label} />
  );
}

const mapStateToProps = (state: AppState) => {
    return {
      isHost: state.game.host?.userToken === state.player.userToken,
      timer: state.timer
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    startTimer: actionCreators.startTimer,
    pauseTimer: actionCreators.pauseTimer
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameTimer);
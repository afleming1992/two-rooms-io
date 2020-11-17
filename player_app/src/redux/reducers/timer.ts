import {Listeners} from "../actions/listeners";
import {ViewState} from "./view";

export interface TimerState {
    initialTime: number,
    secondsLeft: number,
    timerRunning: boolean
}

const initialState = {
    initialTime: 0,
    secondsLeft: 0,
    timerRunning: false
}

export default function timerReducer(state = initialState, action: any) {
    switch( action.type ) {
        case Listeners.GAME_UPDATE:
            if( action.data.timer != undefined ) {
                return Object.assign( {}, state, {
                    initialTime: action.data.timer.initialUnits,
                    timerRunning: checkTimerRunning( action.data.timerRunning, action.data.unitsLeft ),
                    secondsLeft: action.data.timer.unitsLeft
                });
            }
            return state;
        case Listeners.TIMER_UPDATE:
            return Object.assign( {}, state, {
                timerRunning: checkTimerRunning( action.data.timerRunning, action.data.unitsLeft ),
                secondsLeft: action.data.unitsLeft
            })
        default:
            return state;
    }
}

const checkTimerRunning = ( timerRunning: boolean, secondsLeft: number ) => {
    return (timerRunning && secondsLeft > 0);
}
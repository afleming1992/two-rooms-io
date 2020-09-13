import { combineReducers } from "redux";
import playerReducer from "./player";
import errorsReducer from "./errors";
import viewReducer from "./view";
import gameReducer from './game';
import timerReducer from './timer';
import cardReducer from "./card";
import sessionReducer from "./session";
import eventsReducer from "./events";
import revealReducer from "./reveal";

const rootReducer = combineReducers({
        game: gameReducer,
        room: roomReducer,
        player: playerReducer,
        errors: errorsReducer,
        view: viewReducer,
        timer: timerReducer,
        card: cardReducer,
        session: sessionReducer,
        events: eventsReducer,
        reveal: revealReducer
    }
);

export default rootReducer;
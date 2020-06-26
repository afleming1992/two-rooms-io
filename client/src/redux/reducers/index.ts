import { combineReducers } from "redux";
import playerReducer from "./player";
import errorsReducer from "./errors";
import viewReducer from "./view";
import gameReducer from './game';
import timerReducer from './timer';
import cardReducer from "./card";
import sessionReducer from "./session";

const rootReducer = combineReducers({
        game: gameReducer,
        player: playerReducer,
        errors: errorsReducer,
        view: viewReducer,
        timer: timerReducer,
        card: cardReducer,
        session: sessionReducer,
    }
);

export default rootReducer;
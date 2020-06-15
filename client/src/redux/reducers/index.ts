import { combineReducers } from "redux";
import playerReducer from "./player";
import errorsReducer from "./errors";
import viewReducer from "./view";
import gameReducer from './game';

const rootReducer = combineReducers({
        game: gameReducer,
        player: playerReducer,
        errors: errorsReducer,
        view: viewReducer
    }
);

export default rootReducer;
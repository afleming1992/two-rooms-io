import { combineReducers } from "redux";
import playerReducer from "./player";
import errorsReducer from "./errors";

const rootReducer = combineReducers({
        player: playerReducer,
        errors: errorsReducer
    }
);

export default rootReducer;
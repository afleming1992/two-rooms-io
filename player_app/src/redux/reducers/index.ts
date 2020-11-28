import { combineReducers } from "redux";
import playerReducer, {PlayerState} from "./player";
import errorsReducer from "./errors";
import viewReducer, {ViewState} from "./view";
import gameReducer, {GameState} from './game';
import timerReducer, {TimerState} from './timer';
import cardReducer, {CardState} from "./card";
import sessionReducer, {SessionState} from "./session";
import eventsReducer, {EventsState} from "./events";
import revealReducer, {RevealState} from "./reveal";

export interface AppState {
        game: GameState,
        player: PlayerState,
        errors: any,
        view: ViewState,
        timer: TimerState,
        card: CardState,
        session: SessionState,
        events: EventsState,
        reveal: RevealState
}

const rootReducer = combineReducers({
        game: gameReducer,
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
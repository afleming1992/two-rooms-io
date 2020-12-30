import { combineReducers } from "redux";
import playerReducer, {PlayerState} from "./player";
import errorsReducer from "./errors";
import viewReducer, {ViewState} from "./view";
import gameReducer, {GameState} from './game';
import timerReducer, {TimerState} from './timer';
import cardReducer, {CardState} from "./card";
import sessionReducer, {SessionState} from "./session";
import eventsReducer, {EventsState} from "./new_events";
import shareReducer, {ShareState} from "./share";

export interface AppState {
        game: GameState,
        player: PlayerState,
        errors: any,
        view: ViewState,
        timer: TimerState,
        card: CardState,
        session: SessionState,
        events: EventsState,
        share: ShareState,
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
        share: shareReducer
    }
);

export default rootReducer;
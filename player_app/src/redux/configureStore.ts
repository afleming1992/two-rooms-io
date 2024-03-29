import {compose, applyMiddleware, createStore} from "redux";
import rootReducer from "./reducers";
import io from 'socket.io-client';
import createSocketIoMiddleware from './middleware/socketMiddleware';
import {actionListeners} from "./actions/listeners";
import actionCreators from './actions/gameActionCreators';
import {SessionState} from "./reducers/session";
import {gameRequestMiddleware} from "./middleware/gameRequestMiddleware";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const socket = io.connect();

const socketIoMiddleware = createSocketIoMiddleware(socket, actionListeners());

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
    const sessionData = localStorage.getItem("session");
    let session: SessionState = {
        game: undefined,
        token: undefined,
        secret: undefined
    }

    if ( sessionData != null ) {
        const parsedData = JSON.parse( sessionData );
        session.game = parsedData.game != null ? parsedData.game : undefined;
        session.token = parsedData.token != null ? parsedData.token : undefined;
        session.secret = parsedData.secret != null ? parsedData.secret : undefined;
    }

    const initialState = {
        session
    }

    let store = createStore(
        rootReducer,
        initialState,
        composeEnhancers( applyMiddleware(gameRequestMiddleware, socketIoMiddleware) )
    )

    store.subscribe(() => {
        localStorage.setItem("session", JSON.stringify(store.getState().session) )
    });

    socket.on("connect", () => {
        const session = store.getState().session;
        if( session != null && session.game != null && session.token != null && session.secret != null ) {
            store.dispatch(actionCreators.reloadGameSession( session.game, session.token, session.secret ));
        } else {
            store.dispatch({"type":"CONNECTED"});
        }
    });

    socket.on("reconnect", () => {
        store.dispatch({"type":"CONNECTED"});
    })

    socket.on("disconnect", () => {
        store.dispatch({"type":"DISCONNECTED"});
    })

    return store;
}

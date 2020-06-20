import {compose, applyMiddleware, createStore, Store} from "redux";
import rootReducer from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import io from 'socket.io-client';
import createSocketIoMiddleware from './middleware/socketMiddleware';
import {actionListeners} from "./actions/listeners";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const socket = io.connect();

const socketIoMiddleware = createSocketIoMiddleware(socket, actionListeners());

const middlewares = [socketIoMiddleware]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
    let store = createStore(
        rootReducer,
        composeEnhancers( applyMiddleware(...middlewares) )
    )

    socket.on("connect", () => {
        store.dispatch({"type":"CONNECTED"});
    });

    socket.on("reconnect", () => {
        store.dispatch({"type":"CONNECTED"});
    })

    socket.on("disconnect", () => {
        store.dispatch({"type":"DISCONNECTED"});
    })

    return store;
}

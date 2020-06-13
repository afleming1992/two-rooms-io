import {compose, applyMiddleware, createStore, Store} from "redux";
import rootReducer from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import io from 'socket.io-client';
import createSocketIoMiddleware from './middleware/socketMiddleware';
import {actionListeners} from "./actions/listeners";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export default function configureStore() {
    const socket = io.connect(`http://localhost:3001`);

    const socketIoMiddleware = createSocketIoMiddleware(socket, actionListeners());

    const middlewares = [socketIoMiddleware]

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        rootReducer,
        composeEnhancers( applyMiddleware(...middlewares) )
    );
}

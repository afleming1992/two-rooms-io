import {compose, createStore, Store} from "redux";
import rootReducer from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";

export default function configureStore() : Store {
    const store = createStore(
        rootReducer,
        composeWithDevTools());

    if ( module.hot ) {
        module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
    }

    return store;
}

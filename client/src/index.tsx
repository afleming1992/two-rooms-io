import React, {Component, PureComponent, ReactComponentElement} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from "./redux/configureStore";
import 'semantic-ui-css/semantic.min.css';

const store = configureStore();

const render = () => {
    return ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
};



if ( process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./App', render)
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



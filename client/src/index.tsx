import React, {Component, PureComponent, ReactComponentElement} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from "./redux/configureStore";
import 'semantic-ui-css/semantic.min.css';

const store = configureStore();

const render = (Component: React.FunctionComponent) => {
    return ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>,
        document.getElementById('root')
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
       const NextApp = require('./App').default;
       render(NextApp);
    });
}



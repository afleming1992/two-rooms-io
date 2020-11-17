import React from 'react';
import {IonApp, IonLoading} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {connect} from "react-redux";
import {ViewState} from "./redux/reducers/view";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";

interface AppProps {
    connected: boolean
    viewState: ViewState
}

const App: React.FC<AppProps> = (props) => (
  <IonApp>
    <IonLoading
      isOpen={!props.connected}
      message={'Connecting to Server...'}
    />
      {
          props.viewState === ViewState.JOIN_GAME &&
          <Home />
      }
      {
          props.viewState === ViewState.IN_LOBBY &&
          <Lobby />
      }
  </IonApp>
);

const mapStateToProps = (state: any) => {
    return {
        connected: state.player.connected,
        viewState: state.view
    }
}

export default connect(mapStateToProps)(App);

import React from 'react';
import './App.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { ViewState } from "./redux/reducers/view";
import Home from "./pages/Home";
import { connect } from "react-redux";

interface AppProps {
  view: ViewState,
  isConnected: boolean
}

const App: React.FC<AppProps> = (props) => {
  return (
    <div className="App">
      {
         props.view === ViewState.JOIN_GAME &&
           <Home />
      }
    </div>
  );
}

const mapStateToProps = (state: any) => {
    return {
      view: state.view,
      isConnected: state.player.connected
    }
}

export default connect(mapStateToProps)(App);

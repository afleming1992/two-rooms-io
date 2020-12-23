import {Backdrop, CircularProgress, createMuiTheme, CssBaseline, makeStyles, ThemeProvider} from '@material-ui/core';
import React from 'react';
import './App.css';
import {ViewState} from "./redux/reducers/view";
import {connect} from "react-redux";
import {AppState} from "./redux/reducers";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import GameMain from "./pages/GameMain";

interface AppProps {
  view: ViewState,
  connected: boolean,
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: "#a7c0cd",
      main: "#78909c",
      dark: "#4b636e",
      contrastText: "#fff"
    },
    secondary: {
      light: "#62727b",
      main: "#37474f",
      dark: "#102027"
    }
  }
});

const useStyles = makeStyles((theme) => ({
  loadingText: {
    marginLeft: theme.spacing(2)
  }
}));

const App: React.FC<AppProps> = (props) => {
    const classes = useStyles();

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Backdrop open={!props.connected}>
            <CircularProgress color="inherit" />
            <span className={classes.loadingText}>Loading...</span>
          </Backdrop>
          {
            props.view === ViewState.JOIN_GAME &&
              <Home />
          }
          {
            props.view === ViewState.IN_LOBBY &&
              <Lobby />
          }
          {
            props.view === ViewState.IN_ROUND &&
              <GameMain />
          }
      </ThemeProvider>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
      connected: state.player.connected,
      view: state.view
    }
}

export default connect(mapStateToProps)(App);

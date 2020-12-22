import React from 'react';
import { connect } from 'react-redux';
import {AppState} from "../../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import {AppBar, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {ViewState} from "../../redux/reducers/view";
import LobbyNavBar from "./LobbyGameBar";

interface GameAppBarProps {
  view: ViewState
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  }
}));

const GameAppBar:React.FC<GameAppBarProps> = (props) => {
    const classes = useStyles();

    return (
      <div className={classes.grow}>
        <AppBar position="sticky">
            {
              props.view === ViewState.IN_LOBBY &&
              <LobbyNavBar />
            }
        </AppBar>
      </div>
    )
}

const mapStateToProps = (state: AppState) => {
    return {
      view: state.view
    }
}


export default connect(mapStateToProps)(GameAppBar);
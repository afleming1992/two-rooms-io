import React from 'react';
import './App.css';
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import io from "socket.io-client";
import JoinGame from "./components/JoinGame";
import {PlayerState} from "./redux/reducers/types";
import {ViewState} from "./redux/reducers/view";
import GameLobby from "./components/GameLobby";

interface AppProps {
    player: PlayerState,
    view: ViewState
}

const App = ({ player, view,
    ...props
}: AppProps) => {
    return (
        <Container>
            { view == ViewState.JOIN_GAME &&
                <JoinGame />
            }
            {
              view == ViewState.IN_LOBBY &&
                <GameLobby />
            }

        </Container>
    );
}

const mapStateToProps = (state: any) => {
    return {
        player: state.player,
        view: state.view,
    }
}


export default connect(mapStateToProps)(App);

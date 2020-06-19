import React from 'react';
import './App.css';
import {Container, Icon, Message} from "semantic-ui-react";
import {connect} from "react-redux";
import io from "socket.io-client";
import JoinGame from "./components/JoinGame";
import {PlayerState} from "./redux/reducers/types";
import {ViewState} from "./redux/reducers/view";
import GameLobby from "./components/GameLobby";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import RootGameContainer from "./components/RootGameContainer";
import {isHost} from "./utils/isHost";

interface AppProps {
    player: PlayerState,
    view: ViewState
    isHost: boolean
}

const App = ({ player, view, isHost,
    ...props
}: AppProps) => {
    if( player.connected ) {
        return (
            <>
                { view == ViewState.JOIN_GAME &&
                    <JoinGame />
                }
                {
                    view != ViewState.JOIN_GAME &&
                    <RootGameContainer isHost={isHost}>
                    {
                        view == ViewState.IN_LOBBY &&
                        <GameLobby />
                    }
                    </RootGameContainer>
                }
            </>
        );
    } else {
        return (
            <Container>
                <Message icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Connecting you to the game...</Message.Header>
                        Just getting you connected to the game server
                    </Message.Content>
                </Message>
            </Container>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        player: state.player,
        view: state.view,
        isHost: isHost(state.player, state.game.host)
    }
}


export default connect(mapStateToProps)(App);

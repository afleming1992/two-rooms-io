import React from 'react';
import './App.css';
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import {RootState} from "./redux/reducers/initialState";
import io from "socket.io-client";
import JoinGame from "./components/JoinGame";

const App = ({
    ...props
}) => {
    const socket = io("http://localhost:3001");

    return (
        <Container>
            <JoinGame socket={socket} />
        </Container>
    );
}

const mapStateToProps = (state : RootState) => {
    return {
        game: state.game,
        player: state.player
    }
}


export default connect(mapStateToProps)(App);

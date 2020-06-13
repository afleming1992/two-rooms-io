import React from 'react';
import './App.css';
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import io from "socket.io-client";
import JoinGame from "./components/JoinGame";

const App = ({
    ...props
}) => {
    return (
        <Container>
            <JoinGame />
        </Container>
    );
}

const mapStateToProps = (state: any) => {
    return {
        game: state.game,
        player: state.player
    }
}


export default connect(mapStateToProps)(App);

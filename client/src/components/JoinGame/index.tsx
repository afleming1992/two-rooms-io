import React, {Dispatch, useState} from "react";
import Logo from "../logo";
import PlayerLoginForm from "../PlayerLoginForm";
import {connect, DispatchProp} from "react-redux";
import {joinGame} from "../../redux/actions/socketActions";
import {RootState} from "../../redux/reducers/initialState";

interface JoinGameProps {
    socket: SocketIOClient.Socket,
}

const JoinGame = ({socket, ...props}: JoinGameProps) => {
    const [playerName, setPlayerName] = useState();
    const [joining, setJoining] = useState(false);

    function onJoining(event: any) {
        setJoining(true);
        event.preventDefault();
        joinGame(socket, playerName);
    }

    function handleChange(event: any) {
        const {name, value} = event.target;
        if (name === "name") {
            setPlayerName(value);
        }
    }

    return (
        <div id="gameLogin">
            <Logo />
            <PlayerLoginForm onJoining={onJoining} onChange={handleChange} joining={joining} />
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        player: state.player
    }
}

const dispatchProps = {
    joinGame
}

export default connect(mapStateToProps, dispatchProps)(JoinGame);
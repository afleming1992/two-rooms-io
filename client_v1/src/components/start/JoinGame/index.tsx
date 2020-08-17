import React, {useState} from "react";
import { bindActionCreators, Dispatch, ActionCreatorsMapObject } from 'redux';
import Logo from "../../logo";
import PlayerLoginForm from "../PlayerLoginForm";
import {connect, DispatchProp} from "react-redux";
import actionCreators from "../../../redux/actions/creators";
import {Action} from "typesafe-actions";
import {Container} from "semantic-ui-react";

const JoinGame = ({joinGame, joining, ...props}: any) => {
    const [playerName, setPlayerName] = useState();

    function onJoining(event: any) {
        event.preventDefault();
        joinGame(playerName);
    }

    function handleChange(event: any) {
        const {name, value} = event.target;
        if (name === "name") {
            setPlayerName(value);
        }
    }

    return (
        <Container>
            <Logo />
            <PlayerLoginForm errors={props.errors} onJoining={onJoining} onChange={handleChange} joining={joining} />
        </Container>
    )
}

const mapStateToProps = (state: any) => ({
   player: state.player,
   errors: state.errors,
   joining: state.player.joining
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
    bindActionCreators({
        joinGame: actionCreators.joinGame
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
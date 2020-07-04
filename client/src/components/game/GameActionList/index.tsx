import React from 'react';
import {connect} from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {PlayerState} from "../../../redux/reducers/player";
import {User} from "../../../domain/User";
import {Grid} from 'semantic-ui-react';

interface GameActionListProps {
    activePlayer: PlayerState,
    players: User[]
}

const GameActionList = ({ activePlayer, players }: GameActionListProps) => {
    const types = [
        {key: "colour", value: "colour", text: "Colour"},
        {key: "role", value: "role", text: "Role"}
    ]


    return (
        <Grid columns={2}>
            <Grid.Column>

            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
        </Grid>
    )
}

const mapStateToProps = (state: any) => {
    return {
        activePlayer: state.player,
        players: state.game.players,
    }
}

const mapDispatchToProps = (dispatch:Dispatch<any>) =>
    bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameActionList);
import React from 'react';
import {Container, Divider, Grid, Progress, Segment} from "semantic-ui-react";
import {Header, Header as GameLobbyHeader} from "./Header";
import {PlayerList} from "../PlayerList";
import GameSetupPanel from "../GameSetupPanel";
import {User} from "../../domain/User";
import {connect} from "react-redux";
import {GameState} from "../../redux/reducers/game";
import {isHost} from "../../utils/isHost";
import {PlayerState} from "../../redux/reducers/player";

interface GameLobbyProps {
    game: GameState,
    player: PlayerState,
    isHost: boolean
}

const GameLobby = ({game, player, isHost} : GameLobbyProps) => {
    return (
        <Container className="padding-top">
            <Grid columns="equal">
                <Grid.Row padded>
                    <Grid.Column>
                        <Segment textAlign="center">
                            <Header game={game} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row padded columns={2}>
                    <Grid.Column width={6}>
                        <PlayerList showHostControls={isHost} players={ game.players == undefined ? new Array<User>() : game.players } />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <GameSetupPanel />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state: any) => {
    return {
        game: state.game,
        player: state.player,
        isHost: isHost(state.player, state.game.host)
    }
}

export default connect(mapStateToProps)(GameLobby);
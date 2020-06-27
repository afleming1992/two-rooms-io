import React, {Dispatch} from "react";
import {connect} from "react-redux";
import {Container, Grid, Segment} from "semantic-ui-react";
import {ViewState} from "../../redux/reducers/view";
import RoundTimer from "../RoundTimer";
import {TimerState} from "../../redux/reducers/timer";
import {CardState} from "../../redux/reducers/card";
import PlayerCard from "../PlayerCard";
import MainGameOperations from "../MainGameOperations";
import RoundTracker from "../RoundTracker";
import {GameState} from "../../redux/reducers/game";

interface RootGameProps {
    playerCardState: CardState,
    timer: TimerState,
    view: ViewState,
    game: GameState
}

const RootGame = ({playerCardState, timer, view, game, ...props}: RootGameProps) => {
    return (
        <Container className="padding-top">
            <Grid columns={2}>
                <Grid.Column width={6}>
                    <Grid.Row>
                        <RoundTimer timer={timer} />
                    </Grid.Row>
                    <Grid.Row className="padding-top">
                        <PlayerCard card={playerCardState.card == undefined ? undefined : playerCardState.card}/>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Grid.Row>
                        <RoundTracker currentRound={game.round} roundData={game.roundData} />
                    </Grid.Row>
                    <MainGameOperations />
                </Grid.Column>
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state: any) => {
    return {
        timer: state.timer,
        view: state.view,
        playerCardState: state.card,
        game: state.game,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootGame);
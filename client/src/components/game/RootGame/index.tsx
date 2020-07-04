import React, {Dispatch} from "react";
import {connect} from "react-redux";
import {Container, Grid, Segment} from "semantic-ui-react";
import {ViewState} from "../../../redux/reducers/view";
import RoundTimer from "../RoundTimer";
import {TimerState} from "../../../redux/reducers/timer";
import {CardState} from "../../../redux/reducers/card";
import PlayerCard from "../../common/PlayerCard";
import MainGameOperations from "../MainGameOperations";
import RoundTracker from "../RoundTracker";
import {GameState} from "../../../redux/reducers/game";
import HostageInfo from "../HostageInfo";

interface RootGameProps {
    playerCardState: CardState,
    timer: TimerState,
    view: ViewState,
    game: GameState
}

const RootGame = ({playerCardState, timer, view, game, ...props}: RootGameProps) => {
    return (
        <Container className="padding-top">
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column width={6}>
                        <RoundTracker currentRound={game.round} roundData={game.roundData} />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <RoundTimer timer={timer} />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <HostageInfo currentRound={game.round} roundData={game.roundData} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <MainGameOperations />
                    </Grid.Column>
                </Grid.Row>
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
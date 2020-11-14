import React, {Dispatch} from "react";
import {connect} from "react-redux";
import {Container, Grid, Segment} from "semantic-ui-react";
import {ViewState} from "../../../redux/reducers/view";
import {TimerState} from "../../../redux/reducers/timer";
import {CardState} from "../../../redux/reducers/card";
import {GameState} from "../../../redux/reducers/game";
import RevealModal from "../RevealModal";
import MainGameOperations from "../MainGameOperations";
import RoundTimer from "../RoundTimer";
import PlayerCard from "../../common/PlayerCard";
import PlayerActions from "../PlayerActions";

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
                <Grid.Column width={12}>
                    <PlayerActions />
                    <MainGameOperations />
                </Grid.Column>
                <Grid.Column width={4} padded>
                    <RoundTimer timer={timer} />
                    <PlayerCard card={playerCardState.card} />
                </Grid.Column>
            </Grid>
            <RevealModal />
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
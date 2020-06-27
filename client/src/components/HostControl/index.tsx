import React from 'react';
import {Button, Dropdown, Icon, Menu} from "semantic-ui-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faPause, faPlay, faRedo, faStar} from "@fortawesome/free-solid-svg-icons";
import {isHost} from "../../utils/isHost";
import {GameState} from "../../redux/reducers/game";
import {ViewState} from "../../redux/reducers/view";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import actionCreators from "../../redux/actions/creators";
import {Action} from "typesafe-actions";
import {PlayerState} from "../../redux/reducers/player";

interface HostControlProps {
    game: GameState,
    player: PlayerState,
    view: ViewState,
    isHost: boolean,
    nextRound: any,
    startTimer: any,
    pauseTimer: any,
    restartTimer: any
}

const canGameStart = (game: GameState): boolean => {
    if (game.deck != undefined && game.players != undefined) {
        return game.players.length >= game.deck.length;
    }
    return false;
}

const HostControl = ({game, player, view, isHost, nextRound, startTimer, pauseTimer, restartTimer, ...props}: HostControlProps) => {
    const onStartTimer = () => {
        startTimer();
    }

    const onPauseTimer = () => {
        pauseTimer();
    }

    const onRestartTimer = () => {
        restartTimer();
    }

    return (
        <Menu inverted size="huge" attached='top'>
            <Menu.Item header><Icon name="star" /> Host Menu</Menu.Item>
            {
                view == ViewState.IN_ROUND &&
                <>
                  <Dropdown item icon="clock">
                      <Dropdown.Menu>
                          <Dropdown.Item onClick={onStartTimer}>
                            <Icon name='play' color="green" /> Start
                          </Dropdown.Item>
                          <Dropdown.Item icon="pause" onClick={onPauseTimer}>
                            <Icon name='pause' color="red" /> Pause
                          </Dropdown.Item>
                          <Dropdown.Item icon="redo" onClick={onRestartTimer}>
                            <Icon name='redo' /> Restart
                          </Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Menu position="right">
                    <Menu.Item>
                      <Button color="green" onClick={nextRound}>
                        Next Round
                      </Button>
                    </Menu.Item>
                  </Menu.Menu>
                </>
            }
            {
                view == ViewState.IN_LOBBY &&
                <Menu.Menu position="right">
                  <Menu.Item>
                    <Button disabled={!canGameStart(game)} color="green" onClick={nextRound}>
                      Start Game
                    </Button>
                  </Menu.Item>
                </Menu.Menu>
            }
            {
                view == ViewState.END_GAME &&
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Button>Testing</Button>
                    </Menu.Item>
                </Menu.Menu>
            }

        </Menu>
    );
}

const mapStateToProps = (state: any) => {
    return {
        game: state.game,
        player: state.player,
        view: state.view,
        isHost: isHost(state.player, state.game.host)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
    bindActionCreators({
        nextRound: actionCreators.nextRound,
        startTimer: actionCreators.startTimer,
        pauseTimer: actionCreators.pauseTimer,
        restartTimer: actionCreators.restartTimer
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostControl);
import React from 'react';
import {Button, Dropdown, Icon, Menu} from "semantic-ui-react";
import {isHost} from "../../../utils/isHost";
import {GameState} from "../../../redux/reducers/game";
import {ViewState} from "../../../redux/reducers/view";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import actionCreators from "../../../redux/actions/creators";
import {Action} from "typesafe-actions";
import {PlayerState} from "../../../redux/reducers/player";
import {Card} from "../../../domain/Card";

interface HostControlProps {
    game: GameState,
    player: PlayerState,
    view: ViewState,
    isHost: boolean,
    startGame: any,
    nextRound: any,
    startTimer: any,
    pauseTimer: any,
    restartTimer: any,
    revealPlayerAssignment: any
}

const canGameStart = (game: GameState): boolean => {
    if (game.deck !== undefined && game.players !== undefined) {
        return game.players.length >= game.deck.length;
    }
    return false;
}

const HostControl = ({game, player, view, isHost, startGame, nextRound, startTimer, pauseTimer, restartTimer, revealPlayerAssignment, ...props}: HostControlProps) => {
    const onStartTimer = () => {
        startTimer();
    }

    const onPauseTimer = () => {
        pauseTimer();
    }

    const onRestartTimer = () => {
        restartTimer();
    }

    const buildCardRevealMenu = ( deck: Card[] | undefined ) => {
        if ( deck === undefined ) {
            return <></>
        }

        const handleCardReveal = ( card: Card ) => {
            revealPlayerAssignment( card.key );
        }

        return (
            <Dropdown item text="Reveal">
                <Dropdown.Menu>
                    {
                        deck.map( card =>
                            <Dropdown.Item key={card.title} onClick={ () => handleCardReveal(card)}>
                                { card.title }
                            </Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Menu inverted size="huge" attached='top'>
            <Menu.Item header><Icon name="star" /> Host Menu</Menu.Item>
            {
                view == ViewState.INITIAL_ROOM_ALLOCATION &&
                <>
                    <Menu.Menu position="right">
                      <Menu.Item>
                        <Button colour="green" onClick={nextRound}>
                          Deal Cards and Start
                        </Button>
                      </Menu.Item>
                    </Menu.Menu>
                </>
            }
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
                    <Button disabled={!canGameStart(game)} color="green" onClick={startGame}>
                      Start Game
                    </Button>
                  </Menu.Item>
                </Menu.Menu>
            }
            {
                view == ViewState.END_GAME &&
                <>
                    { buildCardRevealMenu( game.deck ) }
                </>
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
        startGame: actionCreators.startGame,
        nextRound: actionCreators.nextRound,
        startTimer: actionCreators.startTimer,
        pauseTimer: actionCreators.pauseTimer,
        restartTimer: actionCreators.restartTimer,
        revealPlayerAssignment: actionCreators.revealPlayerAssignment
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostControl);
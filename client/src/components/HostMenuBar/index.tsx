import React, {Dispatch} from 'react';
import {Button, Menu} from "semantic-ui-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {isHost} from "../../utils/isHost";
import {GameState} from "../../redux/reducers/game";
import {PlayerState} from "../../redux/reducers/types";
import {ViewState} from "../../redux/reducers/view";
import {connect} from "react-redux";

interface HostControlProps {
    game: GameState,
    player: PlayerState,
    view: ViewState,
    isHost: boolean
}

const canGameStart = (game: GameState) : boolean => {
    if( game.deck != undefined && game.players != undefined ) {
        return game.players.length >= game.deck.length;
    }
    return false;
}

const HostControl = ({game, player, view, isHost, ...props} : HostControlProps ) => {
    return (
      <Menu inverted size="huge" attached='top'>
        <Menu.Item header><FontAwesomeIcon icon={ faStar } />&nbsp;&nbsp; Host</Menu.Item>
          {
            view == ViewState.IN_LOBBY &&
            <Menu.Menu position="right">
                <Menu.Item>
                  <Button disabled={!canGameStart(game)} color="green">
                    Start Game
                  </Button>
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HostControl);
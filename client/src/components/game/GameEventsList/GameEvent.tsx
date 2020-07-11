import React from 'react';
import GameEventData, {GameEventType} from '../../../domain/GameEvent';
import {User} from "../../../domain/User";
import {connect} from "react-redux";
import ShareEvent from "./events/ShareEvent";
import {PlayerState} from "../../../redux/reducers/player";

interface GameEventProps {
    event: GameEventData,
    players: Array<User>,
    activePlayer: PlayerState
}

const GameEvent = ({event, players, activePlayer} : GameEventProps) => {
    switch( event.type ) {
        case GameEventType.COLOUR_SHARE:
        case GameEventType.ROLE_SHARE:
            return <ShareEvent event={event} players={players} activePlayer={activePlayer} />
        default:
            return <></>;
    }
}

const mapStateToProps = (state : any) => {
    return {
        players: state.game.players,
        activePlayer: state.player
    }
}

export default connect(mapStateToProps)(GameEvent);
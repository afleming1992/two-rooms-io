import React, {useState} from 'react';
import {Icon, Label, Menu} from "semantic-ui-react";
import {connect} from "react-redux";
import {DeckList} from "../../common/DeckList";
import {Card} from "../../../domain/Card";
import GamePlayerList from "../GamePlayerList";
import {User} from "../../../domain/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faLayerGroup} from "@fortawesome/free-solid-svg-icons";
import GameEventsList from '../GameEventsList';
import {CardState} from "../../../redux/reducers/card";
import {EventsState} from "../../../redux/reducers/events";

interface MainGameOperationsStats {
    activePlayer: User,
    deck: Card[],
    players: User[],
    playerCard: CardState,
    events: EventsState
}

enum MainGameViewState {
    PLAYERS,
    EVENTS,
    DECK
}

const MainGameOperations = ({ activePlayer, deck, players, playerCard, events } : MainGameOperationsStats) => {
    const [ view, setView ] = useState( MainGameViewState.PLAYERS );

    return (
        <>
        <Menu size="large" pointing secondary widths={3}>
            <Menu.Item active={ view == MainGameViewState.PLAYERS } onClick={ () => setView( MainGameViewState.PLAYERS )}>
                <Icon name="users" /> Players
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.EVENTS } onClick={ () => setView( MainGameViewState.EVENTS)}>
               <FontAwesomeIcon icon={faComments} />&nbsp; Events<Label circular>{ events != undefined ? events.pending.length : "0"}</Label>
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.DECK } onClick={ () => setView( MainGameViewState.DECK )}>
                <FontAwesomeIcon icon={faLayerGroup} />&nbsp; Deck
            </Menu.Item>
        </Menu>
            {
                view == MainGameViewState.PLAYERS &&
                <GamePlayerList playerCard={playerCard} activePlayer={activePlayer} players={ players } />
            }
            {
                view == MainGameViewState.EVENTS &&
                <GameEventsList />
            }
            {
                view == MainGameViewState.DECK &&
                <DeckList deck={ deck } />
            }
        </>
    );
}

const mapStateToProps = (state: any) => {
    return {
        deck: state.game.deck,
        activePlayer: state.player,
        players: state.game.players,
        playerCard: state.card,
        events: state.events
    }
}

export default connect(mapStateToProps)(MainGameOperations);
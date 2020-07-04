import React, {useState} from 'react';
import {Button, ButtonGroup, Grid, GridColumn, Icon, Label, Menu, Segment, SegmentGroup, Tab} from "semantic-ui-react";
import {connect} from "react-redux";
import {DeckList} from "../../common/DeckList";
import {GameState} from "../../../redux/reducers/game";
import {Card} from "../../../domain/Card";
import GamePlayerList from "../GamePlayerList";
import {User} from "../../../domain/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faLayerGroup, faShareSquare, faUsers} from "@fortawesome/free-solid-svg-icons";
import GameActionList from "../GameActionList";
import GameEventsList from '../GameEventsList';
import {CardState} from "../../../redux/reducers/card";

interface MainGameOperationsStats {
    activePlayer: User,
    deck: Card[],
    players: User[],
    playerCard: CardState
}

enum MainGameViewState {
    PLAYERS,
    EVENTS,
    DECK,
    ACTIONS
}

const MainGameOperations = ({ activePlayer, deck, players, playerCard } : MainGameOperationsStats) => {
    const [ view, setView ] = useState( MainGameViewState.PLAYERS );

    return (
        <>
        <Menu size="large" pointing secondary widths={3}>
            <Menu.Item active={ view == MainGameViewState.PLAYERS } onClick={ () => setView( MainGameViewState.PLAYERS )}>
                <Icon name="users" /> Players
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.ACTIONS } onClick={ () => setView( MainGameViewState.ACTIONS)}>
               <FontAwesomeIcon icon={faComments} />&nbsp; Events<Label circular>0</Label>
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
                view == MainGameViewState.ACTIONS &&
                <GameActionList />
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
        playerCard: state.card
    }
}

export default connect(mapStateToProps)(MainGameOperations);
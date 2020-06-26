import React, {useState} from 'react';
import {Button, ButtonGroup, Grid, GridColumn, Label, Menu, Segment, SegmentGroup, Tab} from "semantic-ui-react";
import {connect} from "react-redux";
import {DeckList} from "../DeckList";
import {GameState} from "../../redux/reducers/game";
import {Card} from "../../domain/Card";
import GamePlayerList from "../GamePlayerList";
import {User} from "../../domain/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";

interface MainGameOperationsStats {
    deck: Card[],
    players: User[]
}

enum MainGameViewState {
    PLAYERS,
    EVENTS,
    DECK,
}

const MainGameOperations = ({ deck, players } : MainGameOperationsStats) => {
    const [ view, setView ] = useState( MainGameViewState.PLAYERS );

    return (
        <>
        <Menu pointing secondary widths={3}>
            <Menu.Item active={ view == MainGameViewState.PLAYERS } onClick={ () => setView( MainGameViewState.PLAYERS )}>
                Players
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.EVENTS } onClick={ () => setView( MainGameViewState.EVENTS )}>
                Events
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.DECK } onClick={ () => setView( MainGameViewState.DECK )}>
                Deck
            </Menu.Item>
        </Menu>
        <Segment>
            {
                view == MainGameViewState.PLAYERS &&
                <GamePlayerList players={ players } />
            }
            {
                view == MainGameViewState.DECK &&
                <DeckList deck={ deck } />
            }
        </Segment>
        </>
    );
}

const mapStateToProps = (state: any) => {
    return {
        deck: state.game.deck,
        players: state.game.players
    }
}

export default connect(mapStateToProps)(MainGameOperations);
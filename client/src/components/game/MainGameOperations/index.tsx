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
import {RoomName} from "../../../domain/Room";
import {GameRoomsList} from "../GameRoomList";

interface MainGameOperationsStats {
    activePlayer: User,
    deck: Card[],
    players: User[],
    playerCard: CardState,
    events: EventsState,
    currentRoom: RoomName,
    rooms: any,
}

enum MainGameViewState {
    PLAYERS,
    EVENTS,
    DECK,
    ROOMS
}

const MainGameOperations = ({ activePlayer, deck, players, playerCard, events, currentRoom, rooms } : MainGameOperationsStats) => {
    const [ view, setView ] = useState( MainGameViewState.ROOMS );

    return (
        <>
        <Menu size="large" pointing widths={3}>
            <Menu.Item active={ view == MainGameViewState.ROOMS } onClick={ () => setView( MainGameViewState.ROOMS )}>
                <Icon name="home" /> Rooms
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.EVENTS } onClick={ () => setView( MainGameViewState.EVENTS)}>
               <FontAwesomeIcon icon={faComments} />&nbsp; Events<Label circular>{ events != undefined ? events.pending.length : "0"}</Label>
            </Menu.Item>
            <Menu.Item active={ view == MainGameViewState.DECK } onClick={ () => setView( MainGameViewState.DECK )}>
                <FontAwesomeIcon icon={faLayerGroup} />&nbsp; Deck
            </Menu.Item>
        </Menu>
            {
                view == MainGameViewState.ROOMS &&
                <GameRoomsList activePlayer={activePlayer} rooms={rooms} players={players} currentRoom={currentRoom} />
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
        events: state.events,
        currentRoom: state.room.currentRoom,
        rooms: state.room.rooms
    }
}

export default connect(mapStateToProps)(MainGameOperations);
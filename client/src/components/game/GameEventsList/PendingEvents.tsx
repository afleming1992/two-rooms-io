import React, {useEffect, useState} from "react";
import {Header, Card, Button, Image, ItemGroup, Item, Feed, ButtonGroup, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {Action} from "typesafe-actions";
import {User} from "../../../domain/User";
import GameEventData, {GameEventType} from "../../../domain/GameEvent";
import {EventsState} from "../../../redux/reducers/events";
import './index.css';
import creators from "../../../redux/actions/creators";
import {SocketAction} from "../../../redux/actions/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import GameEvent from "./GameEvent";
interface PendingEventsProps {
    events: EventsState,
    players: User[]
}

const PendingEvents = ({events, players, ...props} : PendingEventsProps) => {
    return (
        <>
            <Header>Requests for me</Header>
            <Feed>
            {
                events.pending.map( ( event ) =>  {

                    return (
                        <GameEvent event={event} />
                    )
                })
            }
            </Feed>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {
        events: state.events,
        players: state.game.players
    }
}

export default connect(mapStateToProps)(PendingEvents);
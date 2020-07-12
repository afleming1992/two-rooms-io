import React from "react";
import {Header, Feed} from "semantic-ui-react";
import {connect} from "react-redux";
import {User} from "../../../domain/User";
import {EventsState} from "../../../redux/reducers/events";
import './index.css';
import BaseEvent from './BaseEvent'
interface PendingEventsProps {
    events: EventsState,
    players: User[]
}

const PendingEvents = ({events, players} : PendingEventsProps) => {
    return (
        <>
            <Header>Requests for me</Header>
            <Feed>
            {
                events.pending.map( ( event ) =>  {

                    return (
                        <BaseEvent event={event} />
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
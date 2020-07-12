import React from "react";
import {Feed, Header} from "semantic-ui-react";
import BaseEvent from './BaseEvent'
import {EventsState} from "../../../redux/reducers/events";

import {connect} from "react-redux";

interface MyEventsProps {
    events: EventsState
}

const MyEvents = ({events, ...props} : MyEventsProps) => {
    return (
        <>
            <Header>Requests I've sent</Header>
            <Feed>
                {
                    events.awaitingResponse.map( ( event ) =>  {
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

export default connect(mapStateToProps)(MyEvents);
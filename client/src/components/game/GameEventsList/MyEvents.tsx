import React from "react";
import {Feed, Header} from "semantic-ui-react";
import GameEvent from "./GameEvent";
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

export default connect(mapStateToProps)(MyEvents);
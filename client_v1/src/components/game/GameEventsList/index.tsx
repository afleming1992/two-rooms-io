import React from "react";
import {connect} from "react-redux";
import {Grid} from "semantic-ui-react";
import EventList from "./EventList";
import GameEvent from "../../../domain/GameEvent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInbox} from "@fortawesome/free-solid-svg-icons";

interface GameEventTabProps {
    pending: Array<GameEvent>,
    awaitingResponse: Array<GameEvent>
}

const GameEventTab = ({ pending, awaitingResponse } : GameEventTabProps) => {
    return (
        <Grid columns={2}>
            <Grid.Column>
                <EventList title={<><FontAwesomeIcon icon={faInbox} /> Requests sent to me</>} events={pending}/>
            </Grid.Column>
            <Grid.Column>
                <EventList title={<><FontAwesomeIcon icon={faInbox} /> Requests I've sent</>} events={awaitingResponse} />
            </Grid.Column>
        </Grid>
    )
}

const mapStateToProps = (state: any) => {
    return {
        pending: state.events.pending,
        awaitingResponse: state.events.awaitingResponse
    }
}

export default connect(mapStateToProps)(GameEventTab);
import React, {ReactNode} from "react";
import {Feed, Header, Segment} from "semantic-ui-react";

import {connect} from "react-redux";
import GameEvent, {GameEventType} from "../../../domain/GameEvent";
import ShareEvent from "./events/ShareEvent";
import RevealEvent from "./events/RevealEvent";
import {User} from "../../../domain/User";
import {PlayerState} from "../../../redux/reducers/player";
import {CardShareType} from "../../../domain/Sharing";

interface MyEventsProps {
    events: Array<GameEvent>,
    title: ReactNode,
    players: Array<User>,
    activePlayer: PlayerState
}

const EventList = ({events, title, players, activePlayer, ...props} : MyEventsProps) => {
    if ( events.length == 0 ) {
        return (
            <>
                <Header>{ title }</Header>
                <Segment fluid textAlign="center" color="red">
                    <Header size="huge">
                        <small>No Requests</small>
                    </Header>
                </Segment>
            </>
        )
    }


    return (
        <>
            <Header>{ title }</Header>
            <Feed>
                {
                    events.map( ( event ) =>  {
                        let isRequestor = false;
                        let playerToken : string | undefined = event.requestor;

                        if (event.requestor === activePlayer.userToken) {
                            isRequestor = true;
                            playerToken = event.recipient;
                        }

                        const otherParty = players.filter( player => {
                            return player.userToken === playerToken
                        })[0];

                        switch( event.type ) {
                            case GameEventType.COLOUR_SHARE:
                            case GameEventType.ROLE_SHARE:
                                return <ShareEvent key={event.id}
                                                   eventId={event.id}
                                                   isRequestor={ isRequestor }
                                                   otherParty={otherParty}
                                                   responded={event.responded}
                                                   recipientResponse={event.recipientResponse}
                                                   shownCard={event.shownCard}
                                                   shownColour={event.shownColour}
                                                   shareType={ event.type === GameEventType.ROLE_SHARE ? CardShareType.ROLE : CardShareType.COLOUR }
                                                    />
                            case GameEventType.COLOUR_REVEAL:
                            case GameEventType.ROLE_REVEAL:
                                return <RevealEvent key={event.id} event={event} players={players} />
                            default:
                                return <></>;
                        }
                    })
                }
            </Feed>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {
        players: state.game.players,
        activePlayer: state.player
    }
}

export default connect(mapStateToProps)(EventList);

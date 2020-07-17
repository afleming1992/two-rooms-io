import React from 'react';
import {User} from "../../../../domain/User";
import GameEvent, {GameEventType} from "../../../../domain/GameEvent";
import {Button, Feed, Image} from "semantic-ui-react";
import {Action} from "typesafe-actions/dist/type-helpers";
import {bindActionCreators, Dispatch} from 'redux';
import revealCreators from "../../../../redux/actions/revealCreators";
import creators from "../../../../redux/actions/creators";
import {connect} from "react-redux";

interface RevealEventProps {
    event: GameEvent,
    players: Array<User>,
    doCardReveal: any,
    doColourReveal: any,
    dismissEvent: any
}

const RevealEvent = ({event, players, doCardReveal, doColourReveal, dismissEvent} : RevealEventProps) => {
    let playerToken: string | undefined = event.requestor;

    const player = players.filter( ( player ) => {
        return player.userToken === playerToken;
    })[0];

    const handleColourReveal = () => {
        doColourReveal( event.id, event.shownColour, player.name )
        dismissEvent( event.id );
    }

    const handleCardReveal = () => {
        doCardReveal( event.id, event.shownCard, player.name )
        dismissEvent( event.id );
    }

    return (
        <Feed.Event>
            <Feed.Label><Image size="mini" src={`https://api.adorable.io/avatars/${ player.userToken }.png`} /></Feed.Label>
            <Feed.Content>
                <Feed.Summary>{ buildText( event, player.name ) }</Feed.Summary>
            </Feed.Content>
            <Feed.Meta>
                <Button color="green" onClick={ event.type === GameEventType.COLOUR_REVEAL ? handleColourReveal : handleCardReveal }>Reveal</Button>
            </Feed.Meta>
        </Feed.Event>
    )
}

const buildText = ( event: GameEvent, player: string | undefined ) => {
    switch( event.type ) {
        case GameEventType.COLOUR_REVEAL:
            return <><Feed.User>{player}</Feed.User> - PRIVATE REVEAL COLOUR</>
        case GameEventType.ROLE_REVEAL:
            return <><Feed.User>{player}</Feed.User> - PRIVATE REVEAL ROLE</>
    }
}

const mapStateToProps = (state: any) => {
    return {

    };
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators(
    {
        doCardReveal: revealCreators.doCardReveal,
        doColourReveal: revealCreators.doColourReveal,
        dismissEvent: creators.dismissEvent
    }, dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(RevealEvent);
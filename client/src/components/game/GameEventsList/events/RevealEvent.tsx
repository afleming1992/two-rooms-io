import React from 'react';
import {User} from "../../../../domain/User";
import {PlayerState} from "../../../../redux/reducers/player";
import GameEvent, {GameEventType} from "../../../../domain/GameEvent";
import {Button, Feed, Image} from "semantic-ui-react";
import {Action} from "typesafe-actions/dist/type-helpers";
import { bindActionCreators, Dispatch } from 'redux';
import revealCreators from "../../../../redux/actions/revealCreators";
import creators from "../../../../redux/actions/creators";
import {connect} from "react-redux";

interface RevealEventProps {
    event: GameEvent,
    players: Array<User>,
    doReveal: any,
    dismissEvent: any
}

const RevealEvent = ({event, players, doReveal, dismissEvent} : RevealEventProps) => {
    let playerToken: string | undefined = event.requestor;

    const player = players.filter( ( player ) => {
        return player.userToken === playerToken;
    })[0];

    const handleReveal = () => {
        doReveal(event, player);
        dismissEvent( event.id );
    }

    return (
        <Feed.Event>
            <Feed.Label><Image size="mini" src={`https://api.adorable.io/avatars/${ player.userToken }.png`} /></Feed.Label>
            <Feed.Content>
                <Feed.Summary>{ buildText( event, player.name ) }</Feed.Summary>
            </Feed.Content>
            <Feed.Meta>
                <Button color="green" onClick={handleReveal}>Reveal</Button>
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
        doReveal: revealCreators.doReveal,
        dismissEvent: creators.dismissEvent
    }, dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(RevealEvent);
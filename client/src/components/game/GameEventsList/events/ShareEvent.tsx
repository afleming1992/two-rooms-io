import React, {ReactNode} from 'react';
import GameEventData, {GameEventType} from "../../../../domain/GameEvent";
import {User} from "../../../../domain/User";
import {Button, ButtonGroup, Feed, Image} from 'semantic-ui-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {Action} from "typesafe-actions";
import creators from "../../../../redux/actions/creators";
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from "react-redux";
import {PlayerState} from "../../../../redux/reducers/player";
import {RequestResponse} from "../../../../domain/RequestResponse";
import revealCreators from "../../../../redux/actions/revealCreators";
import reveal from "../../../../redux/reducers/reveal";

interface ShareEventProps {
    event: GameEventData,
    activePlayer: PlayerState,
    players: Array<User>,
    acceptShare: any,
    declineShare: any,
    doReveal: any,
    dismissEvent: any
}

const ShareEvent = ({event, activePlayer, players, acceptShare, declineShare, doReveal, dismissEvent, ...props} : ShareEventProps) => {
    let isRequestor = false;
    let playerToken : string | undefined = event.requestor;

    if ( event.requestor === activePlayer.userToken ) {
        playerToken = event.recipient;
        isRequestor = true;
    }

    const player = players.filter( ( player ) => {
        return player.userToken === playerToken;
    } )[0];

    return (
        <Feed.Event>
            <Feed.Label><Image size="mini" src={`https://api.adorable.io/avatars/${ player.userToken }.png`} /></Feed.Label>
            <Feed.Content>
                <Feed.Summary>{ buildText( event, player.name ) }</Feed.Summary>
            </Feed.Content>
            <Feed.Meta>
                { buildActions( event, isRequestor, acceptShare, declineShare, doReveal, dismissEvent, player ) }
            </Feed.Meta>
        </Feed.Event>
    )
}

const buildText = ( event: GameEventData, player: string | undefined ) => {
    switch( event.type ) {
        case GameEventType.COLOUR_SHARE:
            return <><Feed.User>{ player }</Feed.User> - SHARE COLOUR</>;
        case GameEventType.ROLE_SHARE:
            return <><Feed.User>{ player }</Feed.User> - SHARE ROLE</>;
    }
}

const buildActions = ( gameEvent: GameEventData, isRequestor: boolean, acceptShare: any, declineShare: any, doReveal: any, dismissEvent:any, player: User ) : ReactNode => {
    const handleReveal = () => {
        doReveal(gameEvent, player)
        dismissEvent( gameEvent.id )
    }

    switch ( gameEvent.recipientResponse ) {
        case RequestResponse.ACCEPTED:
            return (
                <Button color="green" onClick={handleReveal}>Reveal</Button>
            )
        case RequestResponse.DECLINED:
            return (
                <Button color="red">Dismiss</Button>
            )
        default:
            if ( isRequestor ) {
                return <></>;
            } else {
                if( !gameEvent.responded ) {
                    return (
                        <ButtonGroup>
                            <Button onClick={ () => acceptShare(gameEvent.id)} inverted color="green">Accept</Button>
                            <Button onClick={ () => declineShare(gameEvent.id)} inverted color="red">Decline</Button>
                        </ButtonGroup>
                    );
                } else {
                    return (
                        <Button color={ gameEvent.accepted ? "green" : "red" } disabled={true}><FontAwesomeIcon icon={faSpinner} spin /></Button>
                    );
                }
            }
    }
}



const mapStateToProps = (state: any) => {
    return {

    };
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators(
    {
        acceptShare: creators.acceptShare,
        declineShare: creators.rejectShare,
        doReveal: revealCreators.doReveal,
        dismissEvent: creators.dismissEvent
    }, dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(ShareEvent);
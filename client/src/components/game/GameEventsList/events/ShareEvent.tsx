import React, {ReactNode} from 'react';
import {User} from "../../../../domain/User";
import {Button, ButtonGroup, Feed, Image} from 'semantic-ui-react';
import {Action} from "typesafe-actions";
import creators from "../../../../redux/actions/creators";
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from "react-redux";
import {RequestResponse} from "../../../../domain/RequestResponse";
import revealCreators from "../../../../redux/actions/revealCreators";
import {Team} from "../../../../domain/Team";
import {Card} from "../../../../domain/Card";
import {CardShareType} from "../../../../domain/Sharing";

interface ShareEventProps {
    eventId: string | undefined,
    isRequestor: boolean,
    otherParty: User,
    shareType: CardShareType,
    responded: boolean | undefined,
    shownCard: Card | undefined,
    shownColour: Team | undefined,
    recipientResponse: RequestResponse,
    acceptShare: any,
    declineShare: any,
    doCardReveal: any,
    doColourReveal: any,
    dismissEvent: any
}

const ShareEvent = ({eventId, otherParty, isRequestor, responded, shareType, recipientResponse, ...props} : ShareEventProps) => {

    if ( recipientResponse == undefined ) {
       recipientResponse = RequestResponse.NO_ANSWER;
   }

    const buildText = () => {
        switch( shareType ) {
            case CardShareType.COLOUR:
                return <><Feed.User>{ otherParty.name }</Feed.User> - SHARE COLOUR</>;
            case CardShareType.ROLE:
                return <><Feed.User>{ otherParty.name }</Feed.User> - SHARE CARD</>;
        }
    }

    const buildActions = () : ReactNode => {
        switch ( recipientResponse ) {
            case RequestResponse.ACCEPTED:
                let action = () => {
                    props.doColourReveal(eventId, props.shownColour, otherParty.name);
                    props.dismissEvent(eventId);
                }
                if ( shareType === CardShareType.ROLE ) {
                    action = () => {
                        props.doCardReveal(eventId, props.shownCard, otherParty.name);
                        props.dismissEvent(eventId);
                    }
                }

                return <Button color="green" onClick={action}>Reveal</Button>
            case RequestResponse.DECLINED:
                return (
                    <Button color="red">Dismiss</Button>
                )
            default:
                if ( isRequestor ) {
                    return <></>;
                } else {
                    if( !responded ) {
                        return (
                            <ButtonGroup>
                                <Button onClick={ () => props.acceptShare(eventId)} inverted color="green">Accept</Button>
                                <Button onClick={ () => props.declineShare(eventId)} inverted color="red">Decline</Button>
                            </ButtonGroup>
                        );
                    }
                }
        }
    }


    return (
        <Feed.Event>
            <Feed.Label><Image size="mini" src={`https://api.adorable.io/avatars/${ otherParty.userToken }.png`} /></Feed.Label>
            <Feed.Content>
                <Feed.Summary>{ buildText() }</Feed.Summary>
            </Feed.Content>
            <Feed.Meta>
                { buildActions() }
            </Feed.Meta>
        </Feed.Event>
    )
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators(
    {
        acceptShare: creators.acceptShare,
        declineShare: creators.rejectShare,
        doCardReveal: revealCreators.doCardReveal,
        doColourReveal: revealCreators.doColourReveal,
        dismissEvent: creators.dismissEvent
    }, dispatch
)

export default connect(() => {}, mapDispatchToProps)(ShareEvent);
import React from 'react';
import {Header, Modal, Segment, SegmentGroup, TransitionablePortal} from "semantic-ui-react";
import { bindActionCreators, Dispatch } from "redux";
import {connect} from "react-redux";
import {Action} from "typesafe-actions";
import revealCreators from "../../../redux/actions/revealCreators";
import {Card} from "../../../domain/Card";
import {Team} from "../../../domain/Team";
import {User} from "../../../domain/User";
import {RoleCard} from "../../common/RoleCard";
import TeamCard from "../../common/TeamCard";

interface RevealModalProps {
    isOpen: boolean,
    card: Card | undefined,
    team: Team | undefined,
    playerName: string | undefined,
    clearReveal: any
}

const RevealModal = ({ isOpen, card, team, playerName, clearReveal } : RevealModalProps ) => {

    const handleClose = () => {
        clearReveal();
    }

    return (
        <Modal
            closeOnTriggerClick
            onClose={handleClose}
            openOnTriggerClick
            open={isOpen}
            size="mini"
            basic
            centered
        >
        <Header textAlign="center">{ playerName }'s { card !== undefined ? "Card" : "Colour"}</Header>
        {
            card !== undefined &&
            <RoleCard card={card}/>
        }
        {
            team !== undefined &&
            <TeamCard team={team} />
        }
        <p>Click anywhere to close this</p>
        </Modal>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isOpen: state.reveal.isOpen,
        card: state.reveal.card,
        team: state.reveal.team,
        playerName: state.reveal.player
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
    clearReveal: revealCreators.clearReveal
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RevealModal);


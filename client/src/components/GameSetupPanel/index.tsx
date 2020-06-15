import React from 'react';
import {Tab} from "semantic-ui-react";
import {DeckList} from "../DeckList";
import {connect} from "react-redux";
import {Card} from "../../domain/Card";

interface GameSetupProps {
    deck: Array<Card>
}

const GameSetupPanel = ({deck} : GameSetupProps) => {

    const panes = [
        {
            menuItem: 'Deck',
            render: () => <Tab.Pane attached={false}><DeckList deck={deck} /></Tab.Pane>,
        }
    ]

    return (
        <Tab menu={{pointing:true}} panes={panes} />
    );
}

const mapStateToProps = (state: any) => {
    return {
        deck: state.game.deck
    }

}

export default connect(mapStateToProps)(GameSetupPanel);
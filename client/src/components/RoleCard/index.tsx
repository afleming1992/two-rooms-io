import React from "react";
import {Card} from "../../domain/Card";
import {Card as SemanticCard, Image, Popup} from 'semantic-ui-react';

interface RoleCardProps {
    card?: Card
    flipped?: boolean
}

export const RoleCard = ({card, flipped}: RoleCardProps) => {
    if (card == undefined || flipped) {
        return (<SemanticCard><Image src="cards/card_back.png"/></SemanticCard>);
    } else {
        return (
            <Popup content={card.howToWin} header={card.title} trigger={<SemanticCard key={card.title}><Image
                src={`cards/${card.cardImage}.png`}/></SemanticCard>}/>
        );
    }
}
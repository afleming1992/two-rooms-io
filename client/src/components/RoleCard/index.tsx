import React from "react";
import {Card} from "../../domain/Card";
import {Card as SemanticCard, Image, Popup} from 'semantic-ui-react';

interface RoleCardProps {
    card: Card
}

export const RoleCard = ({card} : RoleCardProps) => {
    return (
        <Popup content={card.howToWin} header={card.title} trigger={<SemanticCard key={card.title}><Image src={`cards/${card.cardImage}.png`} /></SemanticCard>}/>
    );
}
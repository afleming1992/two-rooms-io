import React, {useState} from "react";
import {Card} from "../../../domain/Card";
import {Card as SemanticCard, Image, Popup} from 'semantic-ui-react';

interface RoleCardProps {
    card?: Card
    flipped?: boolean
}

export const RoleCard = ({card}: RoleCardProps) => {
    const [flipped, setFlipped] = useState(false);

    if (card == undefined || flipped) {
        return (<SemanticCard onClick={ () => setFlipped(false)}><Image src="cards/card_back.png"/></SemanticCard>);
    } else {
        return (
            <Popup content={card.howToWin} header={card.title} trigger={<SemanticCard centered onClick={ () => setFlipped(true)} key={card.title}><Image
                src={`cards/${card.cardImage}.png`}/></SemanticCard>}/>
        );
    }
}
import React from 'react';
import {Card as TwoRoomsCard} from "../../domain/Card";
import {Card, CardGroup, Image, TransitionGroup} from "semantic-ui-react";

interface DeckListProps {
    deck: Array<TwoRoomsCard>
}

export const DeckList = ({deck} : DeckListProps) => {
    return (
        <TransitionGroup as={CardGroup} itemsPerRow={4}>
            {deck.map(( card ) => {
                return (
                    <Card key={card.title}>
                        <Image src={`cards/${card.cardImage}.png`} />
                    </Card>
                )
            })}
        </TransitionGroup>
    )
}
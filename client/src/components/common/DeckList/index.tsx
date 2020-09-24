import React from 'react';
import {Card as TwoRoomsCard} from "../../../domain/Card";
import {Card, CardGroup, Image, TransitionGroup} from "semantic-ui-react";
import {RoleCard} from "../RoleCard";

interface DeckListProps {
    deck: Array<TwoRoomsCard>
}

export const DeckList = ({deck} : DeckListProps) => {
    return (
        <TransitionGroup as={CardGroup} itemsPerRow={5}>
            {deck.map(( card ) => {
                return (
                    <RoleCard card={card} />
                )
            })}
        </TransitionGroup>
    )
}
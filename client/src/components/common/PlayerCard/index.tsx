import React, {ReactNode} from "react";
import {Card} from "../../../domain/Card";
import {Segment, SegmentGroup} from "semantic-ui-react";
import {RoleCard} from "../RoleCard";

interface PlayerCardProps {
    card: Card | undefined
}

const PlayerCard = ({ card }: PlayerCardProps) => {
    const cardNode: ReactNode = card != undefined ? <RoleCard card={card} /> : <RoleCard flipped />

    return (
        <SegmentGroup>
            <Segment>
                Your Card
            </Segment>
            <Segment textAlign={"center"}>
                { cardNode }
            </Segment>
        </SegmentGroup>
    );
};

export default PlayerCard;
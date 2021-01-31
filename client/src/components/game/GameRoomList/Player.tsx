import React from "react";
import {User} from "../../../domain/User";
import {Label, Segment} from "semantic-ui-react";

interface PlayerProps {
    isLeader: boolean,
    player: User
}

export const Player = (props: PlayerProps) => {
    return <Segment>
        <Label size="big"></Label>
    </Segment>;
}
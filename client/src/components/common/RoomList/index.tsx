import React from 'react';
import {List, Segment} from "semantic-ui-react";
import {User} from "../../../domain/User";
import {Player} from "../../lobby/PlayerList";
import Room from "../../../domain/Room";

interface RoomListProps {
    room: Room | undefined
}
const RoomList = ({ room } : RoomListProps) => {
    if( room == undefined ) {
        return <p>Loading...</p>
    }

    return (
        <Segment textAlign="center">
            <h1>{ room.roomName }</h1>
            <List divided verticalAlign='middle'>
                {
                    room.players.map( (player) => {
                        return <Player player={player} showHostControls={false} />
                    })
                }
            </List>
        </Segment>
    )
}

export default RoomList;
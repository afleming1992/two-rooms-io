import React, {useState} from "react";
import {User} from "../../../domain/User";
import {RoomName} from "../../../domain/Room";
import {Menu} from "semantic-ui-react";
import {GameRoom} from "./GameRoom";

interface GameRoomListProps {
    activePlayer: User,
    currentRoom: RoomName,
    rooms: any,
    players: User[]
}


export const GameRoomsList = (props: GameRoomListProps) => {
    const [shownRoom,setShownRoom] = useState(props.currentRoom);

    return (
        <>
            <Menu size="tiny" pointing secondary widths={2}>
                <Menu.Item>
                    Alpha
                </Menu.Item>
                <Menu.Item>
                    Omega
                </Menu.Item>
            </Menu>
            {
                shownRoom == RoomName.ALPHA &&
                <GameRoom currentRoom={ RoomName.ALPHA == props.currentRoom } room={props.rooms[RoomName.ALPHA]} players={props.players} />
            }
        </>
    );
};
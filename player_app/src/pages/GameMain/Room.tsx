import React from 'react';
import PlayerLobby from "../../components/PlayerLobby";
import {User} from "../../domain/User";

interface RoomViewProps {
  players: User[] | undefined,
  host: User | undefined,
  currentPlayer: string | undefined
}

const RoomView: React.FC<RoomViewProps> = (props) => {
  return (
    <PlayerLobby currentPlayer={props.currentPlayer} host={props.host} players={props.players || []} />
  );
}

export default RoomView;
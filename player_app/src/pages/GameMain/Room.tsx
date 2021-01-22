import React from 'react';
import PlayerLobby from "../../components/PlayerLobby";
import {User} from "../../domain/User";
import {Container} from "@material-ui/core";

interface RoomViewProps {
  players: User[] | undefined,
  host: User | undefined,
  currentPlayer: string | undefined
}

const RoomView: React.FC<RoomViewProps> = (props) => {
  return (
    <Container>
      <PlayerLobby currentPlayer={props.currentPlayer} host={props.host} players={props.players || []} />
    </Container>
  );
}

export default RoomView;
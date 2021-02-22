import React, {useState} from 'react';
import PlayerList from "../../components/PlayerList/PlayerList";
import {User} from "../../domain/User";
import {Container, Grid, makeStyles, Paper, Tab, Tabs, Typography} from "@material-ui/core";
import RoomChip from "../../components/RoomChip";
import {RoomName} from "../../domain/Room";
import GamePlayerList from "../../components/PlayerList/GamePlayerList";
import {connect} from "react-redux";
import {AppState} from "../../redux/reducers";
import {RoomState} from "../../redux/reducers/room";

interface RoomViewProps {
  currentPlayer: string | undefined,
  players: User[] | undefined,
  currentRoomState: RoomState,
  rooms: any
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  roomTitle: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1)
  },
  currentRoom: {
    textAlign: "center",
    padding: theme.spacing(1)
  }
}));

const RoomView: React.FC<RoomViewProps> = ({currentRoomState, ...props}) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth={"lg"}>
      {
        currentRoomState.currentRoom &&
        <Paper className={classes.roomTitle}>
          <RoomChip room={currentRoomState.currentRoom} />
        </Paper>
      }
      <GamePlayerList
        inverse={true}
        currentRoom={false}
        currentPlayer={props.currentPlayer}
        players={currentRoomState.playersInRoom || []}
        roomLeader={currentRoomState.currentLeader}
        hostages={[]}/>
    </Container>
  );
}

const mapStateToProps = (state: AppState) => {
    return {
        currentPlayer: state.player.userToken,
        players: state.game.players,
        rooms: state.game.rooms,
        currentRoomState: state.room,
        currentLeader: state.room.currentLeader
    }
}

export default connect(mapStateToProps)(RoomView);
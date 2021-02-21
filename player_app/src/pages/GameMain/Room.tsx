import React, {useState} from 'react';
import PlayerList from "../../components/PlayerList/PlayerList";
import {User} from "../../domain/User";
import {Container, Grid, makeStyles, Paper, Tab, Tabs, Typography} from "@material-ui/core";
import RoomChip from "../../components/RoomChip";
import {RoomName} from "../../domain/Room";
import GamePlayerList from "../../components/PlayerList/GamePlayerList";

interface RoomViewProps {
  players: User[] | undefined,
  host: User | undefined,
  currentPlayer: string | undefined,
  rooms: any
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  roomTabBar: {
    marginBottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(1)
  },
  currentRoom: {
    textAlign: "center",
    padding: theme.spacing(1)
  }
}));

const RoomView: React.FC<RoomViewProps> = (props) => {
  const classes = useStyles();
  const [roomTab, setRoomTab] = useState(RoomName.EAST_WING);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: RoomName) => {
    setRoomTab(newValue)
  }

  const selectedRoom = props.rooms[roomTab]

  return (
    <Container className={classes.root} maxWidth={"lg"}>
      <Paper className={classes.roomTabBar}>
        <Tabs
          value={roomTab}
          onChange={handleTabChange}
          centered>
          <Tab label="East Wing" value={RoomName.EAST_WING} />
          <Tab label="West Wing" value={RoomName.WEST_WING} />
        </Tabs>
      </Paper>
      <GamePlayerList
        inverse={true}
        currentPlayer={props.currentPlayer}
        host={props.host}
        players={selectedRoom.players || []}
        roomLeader={selectedRoom.currentLeader}
        hostages={[]}/>
    </Container>
  );
}

export default RoomView;
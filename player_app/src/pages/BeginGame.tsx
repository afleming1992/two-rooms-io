import React from 'react';
import {Box, Container, CssBaseline, Grid, makeStyles, Paper} from "@material-ui/core";
import GameAppBar from "../components/GameAppBar";
import {AppState} from "../redux/reducers";
import {connect} from "react-redux";
import RoomChip from "../components/RoomChip";
import Room, {RoomName} from "../domain/Room";
import PlayerLobby from "../components/PlayerLobby";

interface BeginGameProps {
  currentRoom: RoomName | undefined,
  rooms: any,
  currentPlayer: string | undefined
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    textAlign: "center"
  }
}));

const BeginGame: React.FC<BeginGameProps> = (props) => {
  const classes = useStyles();

  return (
    <Container disableGutters={true} maxWidth={false}>
      <CssBaseline />
      <GameAppBar />
      <Container maxWidth={"lg"}>
        <Paper className={classes.paper}>
          <p>Welcome to Two Rooms and A Boom!</p>
          <p>Your host will have setup Two Rooms in a Video conference software of choice!</p>
          <p>The Room you will start in is:</p>
          {
            props.currentRoom &&
            <RoomChip room={props.currentRoom} />
          }
          <p>Please move to this Room!</p>
        </Paper>
        {
          props.rooms &&
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <RoomChip room={RoomName.EAST_WING} />
                <PlayerLobby inverse={true} players={props.rooms[RoomName.EAST_WING]?.players || []} currentPlayer={props.currentPlayer} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <RoomChip room={RoomName.WEST_WING} />
                <PlayerLobby inverse={true} players={props.rooms[RoomName.WEST_WING]?.players || []}  currentPlayer={props.currentPlayer} />
              </Paper>
            </Grid>
          </Grid>
        }
      </Container>
    </Container>
  )
}

const mapStateToProps = (state: AppState) => {
    return {
        currentRoom: state.room.currentRoom,
        rooms: state.game.rooms,
        currentPlayer: state.player.userToken
    }
}

export default connect(mapStateToProps)(BeginGame);
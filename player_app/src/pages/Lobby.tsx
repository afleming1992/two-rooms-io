import React, {useState} from "react";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container, makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import {connect} from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLayerGroup, faSlidersH, faUsers } from "@fortawesome/free-solid-svg-icons";
import PlayerLobby from "../components/PlayerLobby";
import {AppState} from "../redux/reducers";
import {User} from "../domain/User";

interface LobbyProps {
  players: User[] | undefined
}

const useStyles = makeStyles({
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  }
});

enum LobbyTabView {
  PLAYERS = "players",
  DECK = "deck",
  SETTINGS = "settings"
}

const Lobby: React.FC<LobbyProps> = (props) => {
  const classes = useStyles();

  const [tabView, setTabView] = useState(LobbyTabView.PLAYERS);


  return (
    <Container disableGutters={true}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Waiting for Players to Join...
          </Typography>
        </Toolbar>
      </AppBar>
      <Box>
      {
          tabView === LobbyTabView.PLAYERS && props.players !== undefined &&
          <PlayerLobby players={props.players} />
      }
      {
          tabView === LobbyTabView.DECK &&
          <h1>Hello Deck Screen</h1>
      }
      </Box>
      <BottomNavigation
        className={classes.stickToBottom}
        value={tabView}
        onChange={(event, newValue) => {
          setTabView(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction icon={<FontAwesomeIcon icon={faLayerGroup} size="2x" />} value={LobbyTabView.DECK} label="Deck" />
        <BottomNavigationAction icon={<FontAwesomeIcon icon={faUsers} size="2x" />} value={LobbyTabView.PLAYERS} label="Players" />
        <BottomNavigationAction icon={<FontAwesomeIcon icon={faSlidersH} size="2x" />} value={LobbyTabView.SETTINGS} label="Settings" />
      </BottomNavigation>
    </Container>
  );
}

const mapStateToProps = (state: AppState) => {
    return {
        players: state.game.players
    }
}

export default connect(mapStateToProps)(Lobby);
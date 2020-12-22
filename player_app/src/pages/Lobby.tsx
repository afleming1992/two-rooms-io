import React, {useState} from "react";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container, CssBaseline, makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import {connect} from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLayerGroup, faSlidersH, faUsers } from "@fortawesome/free-solid-svg-icons";
import PlayerLobby from "../components/PlayerLobby";
import {AppState} from "../redux/reducers";
import {User} from "../domain/User";
import DeckList from "../components/DeckList";
import {Card} from "../domain/Card";

interface LobbyProps {
  players: User[] | undefined
  deck: Card[] | undefined
  host: User | undefined
}

const useStyles = makeStyles({
  stickToBottom: {
    bottom: 0,
    position: "fixed",
    width: "inherit"
  },
  bottomNav: {
    marginBottom: "56px"
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
    <Container className={classes.bottomNav} disableGutters={true} maxWidth={false}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">
            Waiting for Players to Join...
          </Typography>

        </Toolbar>
      </AppBar>
      {
          tabView === LobbyTabView.PLAYERS && props.players !== undefined &&
          <PlayerLobby players={props.players} host={props.host} />
      }
      {
          tabView === LobbyTabView.DECK && props.deck !== undefined &&
          <DeckList deck={props.deck}/>
      }
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
        players: state.game.players,
        deck: state.game.deck,
        host: state.game.host
    }
}

export default connect(mapStateToProps)(Lobby);
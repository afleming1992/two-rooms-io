import React, {useState} from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container, CssBaseline, makeStyles,
} from "@material-ui/core";
import {connect} from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLayerGroup, faSlidersH, faUsers } from "@fortawesome/free-solid-svg-icons";
import PlayerList from "../components/PlayerList/PlayerList";
import {AppState} from "../redux/reducers";
import {User} from "../domain/User";
import DeckList from "../components/DeckList";
import {Card} from "../domain/Card";
import GameAppBar from "../components/GameAppBar";
import JoinCodeBox from "../components/JoinCodeBox";
import clsx from "clsx";

interface LobbyProps {
  players: User[] | undefined
  deck: Card[] | undefined
  host: User | undefined,
  currentPlayer: string | undefined,
  joinCode: string | undefined
}

const useStyles = makeStyles((theme) => ({
  stickToBottom: {
    bottom: 0,
    position: "fixed",
    width: "inherit"
  },
  root: {
    marginBottom: "56px"
  },
  content: {
    padding: theme.spacing(2)
  }
}));

enum LobbyTabView {
  PLAYERS = "players",
  DECK = "deck",
  SETTINGS = "settings"
}

const Lobby: React.FC<LobbyProps> = (props) => {
  const classes = useStyles();

  const [tabView, setTabView] = useState(LobbyTabView.PLAYERS);

  return (
    <Container className={classes.root} disableGutters={true} maxWidth={false}>
      <CssBaseline />
      <GameAppBar />
      <div className={classes.content}>
        <div>
          <JoinCodeBox joinCode={props.joinCode} />
        </div>
        {
          tabView === LobbyTabView.PLAYERS && props.players !== undefined &&
          <PlayerList currentPlayer={props.currentPlayer} players={props.players} host={props.host} />
        }
        {
          tabView === LobbyTabView.DECK && props.deck !== undefined &&
          <DeckList deck={props.deck}/>
        }
      </div>
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
        currentPlayer: state.player.userToken,
        players: state.game.players,
        deck: state.game.deck,
        host: state.game.host,
        joinCode: state.game.joinCode
    }
}

export default connect(mapStateToProps)(Lobby);
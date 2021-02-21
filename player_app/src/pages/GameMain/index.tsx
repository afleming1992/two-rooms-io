import React from 'react';
import {connect} from "react-redux";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
  makeStyles,
} from "@material-ui/core";
import GameAppBar from "../../components/GameAppBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faIdCardAlt, faComments } from '@fortawesome/free-solid-svg-icons';
import RoomView from "./Room";
import {AppState} from "../../redux/reducers";
import {User} from "../../domain/User";
import CardView from './CardView';
import {Card} from "../../domain/Card";
import ActionsView from "./ActionsView";
import ActionsButton from "../../components/ActionsButton";

interface GameMainProps {
  currentPlayer: string | undefined,
  players: User[] | undefined,
  host: User | undefined,
  card: Card | undefined,
  deck: Card[] | undefined,
  rooms: any
}

const useStyles = makeStyles((theme) => ({
  stickToBottom: {
    bottom: 0,
    position: "fixed",
    width: "inherit"
  },
  actionButton: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  bottomNav: {
    marginBottom: "56px"
  }
}));

enum GameMainTabView {
  ROOM,
  ACTIONS,
  CARD
}



const GameMain: React.FC<GameMainProps> = (props) => {
  const [view, setView] = React.useState(GameMainTabView.ACTIONS);

  const classes = useStyles();

  return (
      <Container disableGutters={true} maxWidth={false}>
        <CssBaseline />
        <GameAppBar />
        <div className={classes.bottomNav}>
          {
            view === GameMainTabView.ROOM &&
            <RoomView rooms={props.rooms} currentPlayer={props.currentPlayer} host={props.host} players={props.players} />
          }
          {
            view === GameMainTabView.ACTIONS &&
            <ActionsView />
          }
          {
            view === GameMainTabView.CARD &&
            <CardView card={props.card} deck={props.deck} />
          }
          <ActionsButton />
        </div>
        <BottomNavigation value={view} onChange={(event, newValue) => { setView( newValue ) } } showLabels className={classes.stickToBottom}>
          <BottomNavigationAction label="Room" icon={<FontAwesomeIcon size="2x" icon={faDoorOpen} />} value={GameMainTabView.ROOM} />
          <BottomNavigationAction label="Actions" icon={<FontAwesomeIcon size="2x" icon={faComments} />} value={GameMainTabView.ACTIONS} />
          <BottomNavigationAction label="Card" icon={<FontAwesomeIcon size="2x" icon={faIdCardAlt} />} value={GameMainTabView.CARD} />
        </BottomNavigation>
      </Container>
  );
}

const mapStateToProps = (state: AppState) => {
    return {
        players: state.game.players,
        currentPlayer: state.player.userToken,
        host: state.game.host,
        card: state.card.card,
        deck: state.game.deck,
        rooms: state.game.rooms
    }
}

export default connect(mapStateToProps)(GameMain);
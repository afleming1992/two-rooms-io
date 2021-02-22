import React from 'react';
import {connect} from "react-redux";
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
  makeStyles,
} from "@material-ui/core";
import GameAppBar from "../../components/GameAppBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDoorOpen, faIdCardAlt, faBell} from '@fortawesome/free-solid-svg-icons';
import RoomView from "./Room";
import {AppState} from "../../redux/reducers";
import {User} from "../../domain/User";
import CardView from './CardView';
import {Card} from "../../domain/Card";
import EventsView from "./EventsView";
import ActionsButton from "../../components/ActionsButton";

interface GameMainProps {
  currentPlayer: string | undefined,
  players: User[] | undefined,
  host: User | undefined,
  card: Card | undefined,
  deck: Card[] | undefined,
  rooms: any,
  eventsCount: number
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
  EVENTS,
  CARD
}

const GameMain: React.FC<GameMainProps> = (props) => {
  const [view, setView] = React.useState(GameMainTabView.ROOM);

  const classes = useStyles();

  return (
      <Container disableGutters={true} maxWidth={false}>
        <CssBaseline />
        <GameAppBar />
        <div className={classes.bottomNav}>
          {
            view === GameMainTabView.ROOM &&
            <RoomView />
          }
          {
            view === GameMainTabView.EVENTS &&
            <EventsView />
          }
          {
            view === GameMainTabView.CARD &&
            <CardView card={props.card} deck={props.deck} />
          }
          <ActionsButton />
        </div>
        <BottomNavigation value={view} onChange={(event, newValue) => { setView( newValue ) } } showLabels className={classes.stickToBottom}>
          <BottomNavigationAction label="Events" icon={
            <Badge badgeContent={props.eventsCount} overlap="circle" color="error"><FontAwesomeIcon size="2x" icon={faBell} /></Badge>
          } value={GameMainTabView.EVENTS} />
          <BottomNavigationAction label="Room" icon={<FontAwesomeIcon size="2x" icon={faDoorOpen} />} value={GameMainTabView.ROOM} />
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
        rooms: state.game.rooms,
        eventsCount: state.events.timeline.length
    }
}

export default connect(mapStateToProps)(GameMain);
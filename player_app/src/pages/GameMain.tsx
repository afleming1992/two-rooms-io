import React from 'react';
import {connect} from "react-redux";
import {BottomNavigation, BottomNavigationAction, Container, CssBaseline, makeStyles, Paper} from "@material-ui/core";
import GameAppBar from "../components/GameAppBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faIdCardAlt, faComments } from '@fortawesome/free-solid-svg-icons';

interface GameMainProps {

}

const useStyles = makeStyles((theme) => ({
  stickToBottom: {
    bottom: 0,
    position: "fixed",
    width: "inherit"
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
      {
        view === GameMainTabView.ROOM &&
        <>Room</>
      }
      {
        view === GameMainTabView.ACTIONS &&
        <>Actions</>
      }
      {
        view === GameMainTabView.CARD &&
        <>Card</>
      }
      <BottomNavigation value={view} onChange={(event, newValue) => { setView( newValue ) } } showLabels className={classes.stickToBottom}>
        <BottomNavigationAction label="Room" icon={<FontAwesomeIcon size="2x" icon={faDoorOpen} />} value={GameMainTabView.ROOM} />
        <BottomNavigationAction label="Actions" icon={<FontAwesomeIcon size="2x" icon={faComments} />} value={GameMainTabView.ACTIONS} />
        <BottomNavigationAction label="Card" icon={<FontAwesomeIcon size="2x" icon={faIdCardAlt} />} value={GameMainTabView.CARD} />
      </BottomNavigation>
    </Container>
  );
}

export default connect()(GameMain);
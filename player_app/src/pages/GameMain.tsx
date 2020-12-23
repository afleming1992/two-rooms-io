import React from 'react';
import {connect} from "react-redux";
import {BottomNavigation, BottomNavigationAction, Container, CssBaseline, makeStyles, Paper} from "@material-ui/core";
import GameAppBar from "../components/GameAppBar";

interface GameMainProps {

}

const useStyles = makeStyles((theme) => ({

}));

const GameMain: React.FC<GameMainProps> = (props) => {
  const classes = useStyles();

  return (
    <Container disableGutters={true} maxWidth={false}>
      <CssBaseline />
      <GameAppBar />
      <BottomNavigation>
        <BottomNavigationAction>

        </BottomNavigationAction>
      </BottomNavigation>
    </Container>
  );
}

export default connect()(GameMain);
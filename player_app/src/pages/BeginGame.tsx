import React from 'react';
import {Container, CssBaseline} from "@material-ui/core";
import GameAppBar from "../components/GameAppBar";

interface BeginGameProps {

}

const BeginGame: React.FC<BeginGameProps> = () => {
  return (
    <Container disableGutters={true}>
      <CssBaseline />
      <GameAppBar />
    </Container>
  )
}

export default BeginGame;
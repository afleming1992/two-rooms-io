import React from 'react';
import {Container, makeStyles, Paper, Typography} from "@material-ui/core";

interface JoinGameBoxProps {
  joinCode: string | undefined
}

const useStyles = makeStyles((theme) => ({
  gameCode: {
    textAlign: "center"
  }
}));

const JoinGameBox: React.FC<JoinGameBoxProps> = ({joinCode}) => {
  const classes = useStyles();

  return (
    <Container>
      <Paper className={classes.gameCode}>
        <Typography variant="h4">This Game's Code</Typography>
        <Typography variant="h3">{joinCode}</Typography>
      </Paper>
    </Container>
  )
}

export default JoinGameBox;
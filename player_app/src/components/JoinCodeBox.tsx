import React from 'react';
import {Container, makeStyles, Paper, Typography} from "@material-ui/core";

interface JoinGameBoxProps {
  joinCode: string | undefined
}

const useStyles = makeStyles((theme) => ({
  gameCode: {
    textAlign: "center",
    marginBottom: theme.spacing(1)
  }
}));

const JoinGameBox: React.FC<JoinGameBoxProps> = ({joinCode}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.gameCode}>
      <Typography variant="h4">This Game's Code</Typography>
      <Typography variant="h3">{joinCode}</Typography>
    </Paper>
  )
}

export default JoinGameBox;
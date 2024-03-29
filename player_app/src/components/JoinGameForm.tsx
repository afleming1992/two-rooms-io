import React from 'react';
import {Button, CircularProgress, makeStyles, TextField} from "@material-ui/core";
import {green} from "@material-ui/core/colors";

interface JoinGameFormProps {
  onSubmit(event: any): void,
  onNameChange(event: any): void,
  onGameCodeChange?(event: any): void | undefined,
  joining: boolean,
  errors: any
}

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const JoinGameForm: React.FC<JoinGameFormProps> = (props) => {
  const classes = useStyles();

  return (
    <form className={classes.form} noValidate autoComplete="off" onSubmit={props.onSubmit}>
      <TextField name="name" onChange={props.onNameChange} label="Name" fullWidth required variant="outlined" disabled={props.joining}/>
      {
        props.onGameCodeChange &&
        <TextField name="gameCode" onChange={props.onGameCodeChange} label={"Game Code"} fullWidth required variant="outlined" disabled={props.joining} />
      }
      <div className={classes.buttonWrapper}>
        <Button type="submit" size="large" fullWidth color="primary" className={classes.submit} variant="contained" disabled={props.joining}>Join Game</Button>
        { props.joining && <CircularProgress size={26} className={classes.buttonProgress} /> }
      </div>
    </form>
  );
};

export default JoinGameForm;
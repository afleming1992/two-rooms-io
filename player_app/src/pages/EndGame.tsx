import React from 'react';
import GameAppBar from "../components/GameAppBar";
import {Box, Container, CssBaseline, makeStyles, Paper, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {Action, bindActionCreators, Dispatch} from "redux";
import {AppState} from "../redux/reducers";
import {User} from "../domain/User";
import PlayerAvatarGroup from "../components/PlayerAvatarGroup";
import PlayerReveals from "../components/PlayerReveals";

interface EndGameProps {
  revealedCardAssignments: any,
  players: User[] | undefined
}

const useStyles = makeStyles((theme) => ({
  playerAvatars: {
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  headingText: {
    fontFamily: 'Lato, san-serif',
    textTransform: "uppercase",
    textAlign: 'center'
  },
  reveals: {
    textAlign: 'center'
  }
}));

const EndGame: React.FC<EndGameProps> = (props) => {
  const classes = useStyles();

  return (
    <Container disableGutters={true} maxWidth={false}>
      <CssBaseline />
      <GameAppBar />
      <Container maxWidth={"md"}>
        <Paper className={classes.playerAvatars}>
          <Typography className={classes.headingText}>To be revealed:</Typography>
          <PlayerAvatarGroup players={props.players} />
        </Paper>
        <br />
        <Box className={classes.reveals}>
          <Typography className={classes.headingText}>
            Revealed
          </Typography>
          {
            props.players &&
            <PlayerReveals players={props.players} reveals={props.revealedCardAssignments} />
          }
        </Box>
      </Container>
    </Container>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    revealedCardAssignments: state.game.revealedCardAssignments,
    players: state.game.players
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({

  }, dispatch);

export default connect(mapStateToProps)(EndGame);
import React, {useState} from "react";
import {connect, useDispatch} from "react-redux";
import {Button, Container, makeStyles} from "@material-ui/core";
import JoinGameForm from "../components/JoinGameForm";
import {Action, bindActionCreators, Dispatch} from "redux";
import actionCreators, {createGame, joinGame} from "../redux/actions/gameActionCreators";

interface HomeProps {
  joinGame: any,
  joining: boolean,
  errors: any,
  connected: boolean,
}

const useStyles = makeStyles((theme) => ({
  two_rooms_logo: {
    marginTop: theme.spacing(8),
    fontFamily: "Bebas Neue",
    fontSize: 50,
    textAlign: "center"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

enum HomeScreenView {
  HOME="HOME",
  CREATE_GAME="CREATE_GAME",
  JOIN_GAME="JOIN_GAME"
}

const Home: React.FC<HomeProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [homeScreenView, setHomeScreenView] = useState(HomeScreenView.HOME);

  const onCreateGame = (event:any) => {
    event.preventDefault();
    dispatch(createGame(playerName));
  }

  const onJoining = (event:any) => {
    event.preventDefault();
    dispatch(joinGame(playerName, gameCode.toUpperCase()));
  }

  const onNameChange = (event:any) => {
    const {name, value} = event.target;
    if( name === "name" ) {
      setPlayerName(value);
    }
  }

  const onGameCodeChange = (event:any) => {
    const {name, value} = event.target;
    if( name === "gameCode" ) {
      setGameCode(value);
    }
  }

  return (
      <Container component="main" maxWidth="xs">
        <div className={classes.two_rooms_logo}>
          Two Rooms and a BOOM
        </div>
        <div className={classes.paper}>
          {
            props.connected &&
            (() => {
              switch (homeScreenView) {
                case HomeScreenView.CREATE_GAME:
                  return <JoinGameForm onSubmit={onCreateGame} onNameChange={onNameChange} joining={props.joining} errors={props.errors} />
                case HomeScreenView.JOIN_GAME:
                  return <JoinGameForm onSubmit={onJoining} onNameChange={onNameChange} onGameCodeChange={onGameCodeChange} joining={props.joining} errors={props.errors} />
                default:
                  return (
                    <>
                      <Button size="large" fullWidth color="primary" variant="contained" onClick={() => setHomeScreenView(HomeScreenView.JOIN_GAME)}>
                        Join Game
                      </Button>
                      <br />
                      <Button size="large" fullWidth color="primary" variant="contained" onClick={() => setHomeScreenView(HomeScreenView.CREATE_GAME)}>
                        Create Game
                      </Button>
                    </>
                  )
              }
            })()
          }
        </div>
      </Container>
  );
}

const mapStateToProps = (state: any) => {
    return {
      connected: state.player.connected,
      joining: state.player.joining,
      errors: state.errors
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    joinGame: actionCreators.joinGame
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
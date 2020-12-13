import React, {useState} from "react";
import {connect} from "react-redux";
import {Box, Container, makeStyles, Paper, Typography} from "@material-ui/core";
import './home.css';
import JoinGameForm from "../components/JoinGameForm";
import {Action, bindActionCreators, Dispatch} from "redux";
import actionCreators from "../redux/actions/creators";

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
}}));

const Home: React.FC<HomeProps> = (props) => {
  const classes = useStyles();

  const [playerName, setPlayerName] = useState();


  const onJoining = (event:any) => {
      event.preventDefault();
      props.joinGame(playerName);
  }

  const onNameChange = (event:any) => {
      const {name, value} = event.target;
      if( name === "name" ) {
        setPlayerName(value);
      }
  }

  return (
      <Container component="main" maxWidth="xs">
        <div className={classes.two_rooms_logo}>
          Two Rooms and a BOOM
        </div>
        {
           props.connected &&
           <JoinGameForm onJoining={onJoining} onNameChange={onNameChange} joining={props.joining} errors={props.errors} />
        }
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
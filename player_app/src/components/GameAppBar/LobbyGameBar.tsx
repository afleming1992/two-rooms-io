import React from "react";
import {Chip, makeStyles, Toolbar, Typography} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLayerGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import GameCheckChip from "../GameCheckChip";
import {Action, bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {AppState} from "../../redux/reducers";

interface LobbyNavBar {
  isHost: boolean,
  currentPlayerNumber: number | undefined,
  deckSize: number | undefined
}

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    display: 'block'
  },
  sectionDesktop: {
    display: 'flex'
  },
  playerCheck: {
    marginLeft: theme.spacing(1)
  },
  deckCheck: {
    marginLeft: theme.spacing(1)
  }
}));

const LobbyNavBar: React.FC<LobbyNavBar> = (props) => {
  const classes = useStyles();

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" noWrap>
        Lobby
      </Typography>
      <div className={classes.sectionDesktop}>
        <GameCheckChip label="Players" currentNumber={props.currentPlayerNumber} requiredNumber={props.deckSize} icon={<FontAwesomeIcon icon={faUsers} />}/>
      </div>
    </Toolbar>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
      isHost: state.game.host?.userToken === state.player.userToken,
      currentPlayerNumber: state.game.players?.length,
      deckSize: state.game.deck?.length
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({

  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LobbyNavBar);
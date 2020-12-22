import React from "react";
import {IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCrown, faUsers } from "@fortawesome/free-solid-svg-icons";
import GameCheckChip from "../GameCheckChip";
import {Action, bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {AppState} from "../../redux/reducers";
import actionCreators from "../../redux/actions/creators";

interface LobbyNavBar {
  isHost: boolean,
  currentPlayerNumber: number | undefined,
  deckSize: number | undefined,
  startGame: any
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAdminMenu = () => {
    setAnchorEl(null);
  }

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" noWrap>
        Lobby
      </Typography>
      <div className={classes.sectionDesktop}>
        <GameCheckChip label="Players" currentNumber={props.currentPlayerNumber} requiredNumber={props.deckSize} icon={<FontAwesomeIcon icon={faUsers} />}/>
      </div>
      {
        props.isHost && (
          <div>
            <IconButton onClick={handleAdminMenu}>
              <FontAwesomeIcon icon={faCrown} />
            </IconButton>
            <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={open}
            onClose={handleCloseAdminMenu}
              id="adminmenu-appbar">
              <MenuItem onClick={props.startGame}>Start Game</MenuItem>
            </Menu>
          </div>
        )
      }
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
    startGame: actionCreators.nextRound
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LobbyNavBar);
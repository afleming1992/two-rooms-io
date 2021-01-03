import React from 'react';
import {connect} from "react-redux";
import {IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography} from "@material-ui/core";
import {AppState} from "../../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faForward, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import actionCreators from "../../redux/actions/gameActionCreators";
import GameTimer from './GameTimer';
import HostagesRequiredChip from "./HostagesRequiredChip";
import Round from "../../domain/Round";

interface GameNavBarProps {
  isHost: boolean,
  roundNumber: number | undefined,
  roundData: Round[] | undefined,
  totalRounds: number | undefined,
  nextRound: any,
  restartTimer: any,
  timerRunning: boolean
}

const useStyles = makeStyles( (theme) => ({
  title: {
    flex: 1,
    display: 'flex'
  },
  chips: {
    flex: 1,
    display: 'flex'
  },
  sectionDesktop: {
    display: 'flex'
  },
}));

const GameNavBar: React.FC<GameNavBarProps> = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseAdminMenu = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Typography className={classes.title} variant="h6" noWrap>
        Round { props.roundNumber } / { props.totalRounds || "" }
      </Typography>
      <div className={classes.chips}>
        <GameTimer />
        <HostagesRequiredChip roundData={props.roundData} currentRound={props.roundNumber} />
      </div>
      {
        props.isHost && (
          <>
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
              <MenuItem disabled={props.timerRunning} onClick={props.restartTimer}><ListItemIcon><FontAwesomeIcon icon={faRedoAlt} /></ListItemIcon>Restart Timer</MenuItem>
              <MenuItem onClick={props.nextRound}><ListItemIcon><FontAwesomeIcon icon={faForward} /></ListItemIcon>Next Round</MenuItem>
            </Menu>
          </>
        )
      }
    </>
  )
}

const mapStateToProps = (state: AppState) => {
    return {
        isHost: state.game.host?.userToken === state.player.userToken,
        roundNumber: state.game.round,
        totalRounds: state.game.roundData?.length,
        roundData: state.game.roundData,
        timerRunning: state.timer.timerRunning
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    nextRound: actionCreators.nextRound,
    restartTimer: actionCreators.restartTimer
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameNavBar);
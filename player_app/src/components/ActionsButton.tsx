import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core";
import {SpeedDial, SpeedDialAction} from '@material-ui/lab';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComments, faEye, faPeopleArrows, faPersonBooth} from '@fortawesome/free-solid-svg-icons';
import {AppState} from "../redux/reducers";
import {connect, useDispatch} from "react-redux";
import {
  openNominateLeaderModal,
  openRevealModal,
  openShareModal
} from "../redux/actions/actionModalCreators";

interface ActionsButtonProps {
  isTimerRunning: boolean,
  noLeader: boolean
}

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(10),
    right: theme.spacing(3)
  },
  tooltip: {
    maxWidth: "200px",
    wordWrap: "normal"
  }
}));

const tooltipStyle = makeStyles((theme) => ({
  tooltip: {
    maxWidth: "200px",
    wordWrap: "normal"
  }
}))

const ActionsButton:React.FC<ActionsButtonProps> = (props) => {
  const classes = useStyles();
  const tooltipClasses = tooltipStyle();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const ifNoLeader = () => {
    return props.noLeader;
  }

  const mustBeALeader = () => {
    return !props.noLeader;
  }

  const actions = [
    { icon: <FontAwesomeIcon icon={faPersonBooth} />, name: "Choose Leader", onClick: () => dispatch(openNominateLeaderModal()), show: ifNoLeader },
    { icon: <FontAwesomeIcon icon={faEye} />, name: "Private Reveal", onClick: () => dispatch(openRevealModal()), show: mustBeALeader },
    { icon: <FontAwesomeIcon icon={faPeopleArrows} />, name: "Share", onClick: () => dispatch(openShareModal()), show: mustBeALeader }
  ]

  return (
    <SpeedDial
      className={classes.speedDial}
      ariaLabel="Actions SpeedDial"
      hidden={false} // Need to change this back to isTimerRunning once development is completed
      icon={<FontAwesomeIcon icon={faComments} />}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
      FabProps={{size: "large"}}>
      {
        actions.map((action) => {
          if(action.show()) {
            return (<SpeedDialAction
              title={""}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              TooltipClasses={tooltipClasses}
              onClick={action.onClick}
            />);
          }
          return <></>
        })
      }
    </SpeedDial>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    isTimerRunning: state.timer.timerRunning,
    noLeader: state.room.currentLeader === undefined
  }
}

export default connect(mapStateToProps)(ActionsButton);

import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from '@material-ui/lab';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComments, faEye, faPeopleArrows, faTimes} from '@fortawesome/free-solid-svg-icons';
import {AppState} from "../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";

interface ActionsButtonProps {
  hidden: boolean
}

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(10),
    right: theme.spacing(3)
  }
}));

const ActionsButton:React.FC<ActionsButtonProps> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <FontAwesomeIcon icon={faEye} />, name: "Private Reveal" },
    { icon: <FontAwesomeIcon icon={faPeopleArrows} />, name: "Share" }
  ]

  return (
    <SpeedDial
      className={classes.speedDial}
      ariaLabel="Actions SpeedDial"
      hidden={props.hidden}
      icon={<FontAwesomeIcon icon={faComments} />}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
      FabProps={{size: "large"}}>
      {
        actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => setOpen(false)}
          />
        ))
      }
    </SpeedDial>
  )
}

const mapStateToProps = (state: AppState) => {
  return {

  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({

  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsButton);

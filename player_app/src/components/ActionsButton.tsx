import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from '@material-ui/lab';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComments, faEye, faPeopleArrows, faTimes} from '@fortawesome/free-solid-svg-icons';
import {AppState} from "../redux/reducers";
import {Action, bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import actionModalCreators from "../redux/actions/actionModalCreators";

interface ActionsButtonProps {
  hidden: boolean,
  openRevealModal: any,
  openShareModal: any
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

  const openPrivateReveal = () => {
    props.openRevealModal()
  }

  const openShareModal = () => {
    props.openShareModal()
  }

  const actions = [
    { icon: <FontAwesomeIcon icon={faEye} />, name: "Private Reveal", onClick: openPrivateReveal },
    { icon: <FontAwesomeIcon icon={faPeopleArrows} />, name: "Share", onClick: openShareModal }
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
            onClick={action.onClick}
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
    openRevealModal: actionModalCreators.openRevealModal,
    openShareModal: actionModalCreators.openShareModal
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsButton);

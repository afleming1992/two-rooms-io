import React from 'react';
import {AppState} from "../../redux/reducers";
import {connect} from "react-redux";
import {Action, bindActionCreators, Dispatch} from "redux";
import {clearReveal} from "../../redux/actions/revealCreators";
import {AppBar, Dialog, IconButton, makeStyles, Slide, Toolbar, Typography} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";
import ShareReveal from "../../domain/ShareReveal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {getPlayerByToken} from "../../utils/player";
import {User} from "../../domain/User";
import TeamReveal from './TeamReveal';
import RoleReveal from "./RoleReveal";
import { respondToEvent } from '../../redux/actions/gameActionCreators';

interface RevealModalProps {
  showRevealModal: boolean
  currentShare: ShareReveal | undefined
  dismissReveal: any,
  respondToEvent: any,
  players: User[] | undefined
}

const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    itemText: {
      marginLeft: theme.spacing(2)
    }
  }
))

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RevealModal: React.FC<RevealModalProps> = ({currentShare, ...props}) => {
  const classes = useStyles();

  let player = undefined;
  if ( currentShare ) {
    player = getPlayerByToken( currentShare.player, props.players );
  }

  const handleClose = () => {
    props.respondToEvent(currentShare?.id);
    props.dismissReveal(currentShare?.id);
  }

  return (
    <Dialog fullScreen open={props.showRevealModal} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            { player?.name }'s { currentShare?.team !== undefined ? "Team" : "Role" }
          </Typography>
        </Toolbar>
      </AppBar>
      {
        currentShare?.team && player &&
        <TeamReveal player={player} team={currentShare.team} />
      }
      {
        currentShare?.role && player &&
        <RoleReveal player={player} role={currentShare.role} />
      }
    </Dialog>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    showRevealModal: state.share.showRevealModal,
    currentShare: state.share.currentShare,
    players: state.game.players
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    dismissReveal: clearReveal,
    respondToEvent: respondToEvent
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RevealModal);


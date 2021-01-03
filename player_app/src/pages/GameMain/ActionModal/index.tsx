import React, {useState} from 'react';
import {connect} from "react-redux";
import {
  AppBar, Avatar,
  Button,
  Dialog, Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Slide,
  Toolbar,
  Typography
} from "@material-ui/core";
import {Action, bindActionCreators, Dispatch} from "redux";
import {AppState} from "../../../redux/reducers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {TransitionProps} from "@material-ui/core/transitions";
import {ActionMode} from "../../../redux/reducers/actionModal";
import actionModalCreators from "../../../redux/actions/actionModalCreators";
import PlayerAvatar from "../../../components/PlayerAvatar";
import {User} from "../../../domain/User";
import {CardShareType} from "../../../domain/Sharing";
import gameActionCreators from "../../../redux/actions/gameActionCreators";
import { Card as RoleCard } from '../../../domain/Card';

interface ActionModalProps {
  isActionModalOpen: boolean,
  actionType: ActionMode,
  closeModal: any,
  card: RoleCard | undefined
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
      flex: 1,
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ActionModal:React.FC<ActionModalProps> = (props) => {
  const classes = useStyles();

  const [player, setPlayer] = useState<User | undefined>(undefined);
  const [type, setType] = useState<CardShareType | undefined>( undefined);

  const handleClose = () => {
    props.closeModal()
  }

  const canSend = ( type: ActionMode ) => {
    switch( type ) {
      case ActionMode.REVEAL:
        return player !== undefined && type !== undefined;
      case ActionMode.SHARE:
        return player !== undefined && type !== undefined;
      default:
        return false;
    }
  }

  const onSend = () => {
    switch (props.actionType) {
      case ActionMode.REVEAL:
        if( player !== undefined && type !== undefined ) {
          gameActionCreators.privateReveal(type, player);
        }
        break;
      case ActionMode.SHARE:
        if( player !== undefined && type !== undefined ) {
          gameActionCreators.requestShare(type, player);
        }
        break;
    }
  }

  return (
    <Dialog fullScreen open={props.isActionModalOpen} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Share
          </Typography>
          <Button disabled={!canSend(props.actionType)} autoFocus color="inherit" onClick={onSend}>
            Send
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem button>
          <ListItemAvatar>
            <Avatar src={`role/${ props.card?.cardImage }.png`} />
          </ListItemAvatar>
          <ListItemText primary="Type" secondary="Colour" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemAvatar>
            <PlayerAvatar player={ player } isHost={ false } />
          </ListItemAvatar>
          <ListItemText primary={"Selected Player"} secondary={ player?.name || "-" } />
        </ListItem>
      </List>
    </Dialog>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isActionModalOpen: state.actionModal.isActionModalOpen,
    actionType: state.actionModal.actionType,
    card: state.card.card
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    closeModal: actionModalCreators.closeModal
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionModal);
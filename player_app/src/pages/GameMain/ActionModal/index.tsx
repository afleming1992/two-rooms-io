import React, {useState} from 'react';
import {connect} from "react-redux";
import {
  AppBar,
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

interface ActionModalProps {
  isActionModalOpen: boolean,
  actionType: ActionMode,
  closeModal: any
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

  const onSend = () => {

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
          <Button disabled={true} autoFocus color="inherit" onClick={handleClose}>
            Send
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem button>
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
    actionType: state.actionModal.actionType
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    closeModal: actionModalCreators.closeModal
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionModal);
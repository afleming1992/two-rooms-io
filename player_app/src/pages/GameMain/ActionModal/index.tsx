import React, {useState} from 'react';
import {connect, useDispatch} from "react-redux";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {TransitionProps} from "@material-ui/core/transitions";
import {ActionMode} from "../../../redux/reducers/actionModal";
import actionModalCreators from "../../../redux/actions/actionModalCreators";
import PlayerAvatar from "../../../components/PlayerAvatar";
import {User} from "../../../domain/User";
import {CardShareType} from "../../../domain/Sharing";
import gameActionCreators, {nominateLeader} from "../../../redux/actions/gameActionCreators";
import { Card as RoleCard } from '../../../domain/Card';
import PlayerDialog from "./PlayerDialog";
import CardShareTypeAvatar from "../../../components/CardShareTypeAvatar";
import ShareTypeDialog from './ShareTypeDialog';
import {AppState} from "../../../redux/reducers";
import {RoomName} from "../../../domain/Room";
import {RoomState} from "../../../redux/reducers/room";

interface ActionModalProps {
  isActionModalOpen: boolean,
  actionType: ActionMode,
  closeModal: any,
  card: RoleCard | undefined,
  room: RoomState,
  currentPlayer: User,
  privateReveal: any,
  requestShare: any,
  currentRoom: RoomName | undefined
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
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

enum ActionModalField {
  INFO_TYPE="INFO_TYPE",
  PLAYER_CHOICE="PLAYER_CHOICE"
}

interface ModalSetting {
  title: string
  fields: Array<ActionModalField>
  canSend: any
  onSend: any
}

const ActionModal:React.FC<ActionModalProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [player, setPlayer] = useState<User | undefined>(undefined);
  const [type, setType] = useState<CardShareType | undefined>( undefined);
  const [playerDialogOpen, setPlayerDialogOpen] = useState<boolean>(false);
  const [shareTypeDialogOpen, setShareTypeDialogOpen] = useState<boolean>(false);

  const handleClose = () => {
    props.closeModal()
    setPlayer(undefined);
    setType(undefined);
  }

  const onPlayerDialogClose = (selectedPlayer: User) => {
    setPlayer(selectedPlayer);
    setPlayerDialogOpen(false);
  }

  const onShareTypeDialogClose = (selectedType: CardShareType) => {
    setType(selectedType);
    setShareTypeDialogOpen(false);
  }

  const getModalSettings = ( actionMode: ActionMode ) => {
    const setting = modalSettings.get( actionMode );

    if( setting === undefined ) {
      return {
        title: "No Op",
        fields: [],
        canSend: () => { return false; },
        onSend: () => {}
      }
    } else {
      return setting;
    }
  }

  const modalSettings:Map<ActionMode, ModalSetting> = new Map([
    [ ActionMode.SHARE, {
      title: "Share",
      fields: [ActionModalField.INFO_TYPE, ActionModalField.PLAYER_CHOICE],
      canSend: () => player !== undefined && type !== undefined,
      onSend: () => {
        if( player !== undefined && type !== undefined) {
          props.requestShare( type, player );
          handleClose();
        }
      }
    }
    ],
    [
      ActionMode.REVEAL, {
      title: "Private Reveal",
      fields: [ActionModalField.INFO_TYPE, ActionModalField.PLAYER_CHOICE],
      canSend: () => player !== undefined && type !== undefined,
      onSend: () => {
        if( player !== undefined && type !== undefined) {
          props.privateReveal( type, player );
          handleClose();
        }
      }
    }],
    [
      ActionMode.NOMINATE_LEADER, {
      title: "Nominate Room Leader",
      fields: [ActionModalField.PLAYER_CHOICE],
      canSend: () => player !== undefined,
      onSend: () => {
        if (player !== undefined && props.currentRoom) {
          dispatch(nominateLeader(props.currentRoom, player));
          handleClose();
        }
      }
    }]
  ]);

  const modeSettings = getModalSettings(props.actionType);

  const handleRequestSend = () => {
    modeSettings.onSend();
  }

  return (
    <>
      <Dialog fullScreen open={props.isActionModalOpen} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              { modeSettings.title }
            </Typography>
            <Button disabled={!modeSettings.canSend} color="inherit" onClick={handleRequestSend}>
              Send
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {
            modeSettings.fields.includes(ActionModalField.INFO_TYPE) &&
            <>
              <ListItem button onClick={() => setShareTypeDialogOpen(true)}>
              {
                props.card !== undefined &&
                <ListItemAvatar>
                  <CardShareTypeAvatar card={props.card} type={type} />
                </ListItemAvatar>
              }
                <ListItemText className={classes.itemText} primary="Type" secondary={ type } />
              </ListItem>
              <Divider />
              <ShareTypeDialog card={props.card} selectedValue={type} open={shareTypeDialogOpen} onClose={onShareTypeDialogClose} />
            </>
          }
          {
            modeSettings.fields.includes(ActionModalField.PLAYER_CHOICE) &&
            <>
              <ListItem button onClick={() => setPlayerDialogOpen(true)}>
                <ListItemAvatar>
                  <PlayerAvatar player={ player } isHost={ false } />
                </ListItemAvatar>
                <ListItemText className={classes.itemText} primary={"Selected Player"} secondary={ player?.name || "-" } />
              </ListItem>
              <Divider />
              <PlayerDialog players={props.room.playersInRoom} excludePlayers={[ props.currentPlayer ]} selectedValue={player} open={playerDialogOpen} onClose={onPlayerDialogClose} />
            </>
          }
        </List>
      </Dialog>
    </>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    isActionModalOpen: state.actionModal.isActionModalOpen,
    actionType: state.actionModal.actionType,
    card: state.card.card,
    room: state.room,
    currentPlayer: state.player,
    currentRoom: state.room.currentRoom
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({
    closeModal: actionModalCreators.closeModal,
    privateReveal: gameActionCreators.privateReveal,
    requestShare: gameActionCreators.requestShare
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionModal);
import React from 'react';
import {User} from "../../../domain/User";
import {Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import PlayerAvatar from "../../../components/PlayerAvatar";

interface PlayerDialogProps {
  players: User[] | undefined,
  selectedValue: User | undefined,
  open: boolean,
  onClose: any,
  excludePlayers: User[]
}

const useStyles = makeStyles((theme) => ({
  itemText: {
    paddingLeft: theme.spacing(2),
  },
}));

const PlayerDialog: React.FC<PlayerDialogProps> = (props) => {
  const classes = useStyles();

  const handleClose = (selectedValue: User | undefined) => {
    props.onClose(selectedValue);
  };

  const handleListItemClick = (value: User) => {
    props.onClose(value);
  };

  const isExcludedPlayer = (player: User) => {
    return props.excludePlayers.find( ( excludedPlayer ) => player.userToken === excludedPlayer.userToken ) !== undefined;
  }

  if( props.players === undefined ) {
    props.players = [];
  }

  return (
    <Dialog onClose={() => { handleClose(props.selectedValue) }} aria-labelledby="simple-dialog-title" open={props.open}>
      <DialogTitle id="simple-dialog-title">Select Player</DialogTitle>
      <List>
        {props.players.map((player) => {
            if( isExcludedPlayer(player) ) {
              return <></>;
            }

            return (
              <ListItem button onClick={() => handleListItemClick(player)} key={player.userToken}>
                <ListItemAvatar>
                  <PlayerAvatar player={player} isHost={false}/>
                </ListItemAvatar>
                <ListItemText className={classes.itemText} primary={player.name}/>
              </ListItem>
            )
          }
        )}
      </List>
    </Dialog>
  );
}

export default PlayerDialog
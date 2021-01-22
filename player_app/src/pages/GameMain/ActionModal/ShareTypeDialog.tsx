import React from 'react';
import {CardShareType} from "../../../domain/Sharing";
import {Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import {Card} from "../../../domain/Card";
import CardShareTypeAvatar from "../../../components/CardShareTypeAvatar";

interface ShareTypeDialogProps {
  selectedValue: CardShareType | undefined,
  open: boolean,
  onClose: any,
  card: Card | undefined
}

const useStyles = makeStyles((theme) => ({
  itemText: {
    paddingLeft: theme.spacing(2),
  },
  avatar: {
    height: theme.spacing(7),
    width: theme.spacing(7)
  }
}));

const ShareTypeDialog: React.FC<ShareTypeDialogProps> = (props) => {
  const classes = useStyles();

  const values = [
    {
      key: CardShareType.COLOUR,
      text: "Colour"
    },
    {
      key: CardShareType.ROLE,
      text: "Role"
    }
  ];

  const handleClose = (selectedValue: CardShareType | undefined) => {
    props.onClose(selectedValue);
  }

  const handleListItemClick = (value: CardShareType) => {
    props.onClose(value);
  }

  return (
    <Dialog onClose={() => { handleClose(props.selectedValue) }} aria-labelledby="simple-dialog-title" open={props.open}>
      <DialogTitle id="simple-dialog-title">Select Type</DialogTitle>
      <List>
        {
          values.map((value) => (
            <ListItem button onClick={() => handleListItemClick(value.key)} key={value.key}>
              {
                  props.card !== undefined &&
                  <ListItemAvatar>
                    <CardShareTypeAvatar card={props.card} type={value.key} />
                  </ListItemAvatar>
              }
              <ListItemText className={classes.itemText} primary={value.text}/>
            </ListItem>
          ))
        }
      </List>
    </Dialog>
  );
}

export default ShareTypeDialog;
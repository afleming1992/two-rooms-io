import React from 'react';
import { Card } from "../domain/Card";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper
} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface CardListProps {
  deck: Card[] | undefined
  excludedCards?: Card[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  listItem: {
    marginBottom: theme.spacing(1)
  },
  cardAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  listItemText: {
    paddingLeft: theme.spacing(5)
  }
}));

const CardList: React.FC<CardListProps> = (props) => {
  const classes = useStyles();

  let deck = props.deck;
  if ( deck === undefined ) {
    deck = [];
  }

  return (
    <List className={classes.root}>
      {
        deck.map((card) =>
          <ListItem className={classes.listItem} component={Paper}>
            <ListItemAvatar>
              <Avatar className={classes.cardAvatar} src={`role/${ card.cardImage }.png`} />
            </ListItemAvatar>
            <ListItemText className={classes.listItemText} primary={card.title} secondary={card.subtitle} />
            <ListItemSecondaryAction>
              <IconButton disabled edge="end" aria-label="more-info">
                <FontAwesomeIcon icon={faInfoCircle} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      }
    </List>
  )
}

export default CardList;
import React from 'react';
import { Card } from '../../domain/Card';
import { Container, makeStyles, Typography} from "@material-ui/core";
import PlayerCard from '../../components/PlayerCard';
import CardList from "../../components/CardList";

interface CardViewProps {
  card: Card | undefined,
  deck: Card[] | undefined
}

const useStyles = makeStyles((theme) => ({

}));

const CardView: React.FC<CardViewProps> = (props) => {
  const classes = useStyles();

  const excludedCards: Card[] = [];

  if ( props.card ) {
    excludedCards.push( props.card )
  }

  return (
    <Container>
      {
        props.card !== undefined &&
        <PlayerCard card={props.card} />
      }
      <br />
      <Typography variant="h5">
        All Cards
      </Typography>
      <CardList deck={props.deck} excludedCards={excludedCards} />
    </Container>
  );
}

export default CardView;
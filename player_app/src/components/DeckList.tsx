import {
  Box,
  Container,
  GridList,
  GridListTile,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  withStyles
} from "@material-ui/core";
import React from "react";
import {Card} from "../domain/Card";
import CardList from "./CardList";

interface DeckListProps {
  deck: Card[]
}

const useStyles = makeStyles((theme) => ({

}));

const DeckList: React.FC<DeckListProps> = (props) => {
  const classes = useStyles();

  return (
    <Container>
      <CardList deck={props.deck} />
    </Container>
  )
}

export default DeckList;
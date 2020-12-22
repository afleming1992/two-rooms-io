import {Box, GridList, GridListTile, makeStyles} from "@material-ui/core";
import React from "react";
import {Card} from "../domain/Card";

interface DeckListProps {
  deck: Card[]
}

const useStyles = makeStyles((theme) => ({
  gridList: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  tile: {
    maxWidth: 179,
  },
  cardImage: {
    maxWidth: 179
  }
}));

const DeckList: React.FC<DeckListProps> = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <GridList cellHeight={259} cols={3}>
        { props.deck.map(( card ) => (
          <GridListTile className={classes.tile} cols={1}>

            <img className={classes.cardImage} src={`cards/${card.cardImage}.png`} alt={card.title} />
          </GridListTile>
        ))}
      </GridList>
    </Box>
  )
}

export default DeckList;
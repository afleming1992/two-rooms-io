import {Box, GridList, GridListTile, makeStyles, Theme, Tooltip, Typography, withStyles} from "@material-ui/core";
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

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);


const DeckList: React.FC<DeckListProps> = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <GridList cellHeight={259} cols={3}>
        { props.deck.map(( card ) => (
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{ card.title }</Typography>
                <p>{ card.howToWin }</p>
              </React.Fragment>
            }
            enterTouchDelay={0}
          >
          <GridListTile className={classes.tile} cols={1}>

            <img className={classes.cardImage} src={`cards/${card.cardImage}.png`} alt={card.title} />
          </GridListTile>
          </HtmlTooltip>
        ))}
      </GridList>
    </Box>
  )
}

export default DeckList;
import React from 'react';
import {Card as RoleCard} from "../domain/Card";
import {Card, CardContent, CardMedia, makeStyles, Typography} from "@material-ui/core";
import TeamChip from "./TeamChip";

interface PlayerCardProps {
  card: RoleCard
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    display: 'flex',
    marginBottom: theme.spacing(2)
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  youAreThe: {
    fontFamily: 'Lato, san-serif',
    textTransform: "uppercase",
  },
  roleTitle: {
    fontFamily: 'Bebas Neue',
    textTransform: "uppercase",
    fontSize: "4em",
    fontWeight: "bolder"
  },
  subtitle: {
    fontFamily: 'Lato, san-serif',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    paddingTop: theme.spacing(2)
  },
  content: {
    flex: "1 0 auto"
  },
  cardImage: {
    width: 200
  },
  cover: {
    width: 200,
    height: 300
  }
}));

const PlayerCard: React.FC<PlayerCardProps> = (props) => {
  const classes = useStyles();

  if ( !props.card ) {
    return <></>
  }
  return (
    <Card className={classes.root} raised>
      <CardMedia
        className={classes.cover}
        image={`role/${props.card.cardImage}.png`}
        title={ props.card.title }
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.youAreThe}>
            You are the
          </Typography>
          <Typography className={classes.roleTitle} variant="h3">
            { props.card.title }
          </Typography>
          <TeamChip team={props.card.team} />
          <Typography className={classes.subtitle} variant="subtitle1">
            { props.card.subtitle }
          </Typography>
          <br />
          <Typography component="p" variant="body1">
            { props.card.howToWin }
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}

export default PlayerCard;
import React from 'react';
import {Card as RoleCard} from "../domain/Card";
import {Avatar, Card, CardContent, CardMedia, makeStyles, Typography} from "@material-ui/core";
import TeamChip from "./TeamChip";

interface PlayerCardProps {
  card: RoleCard,
  introText: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
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
  avatar: {
    height: theme.spacing(7),
    width: theme.spacing(7),
    margin: theme.spacing(2)
  },
  role: {
    fontFamily: 'Bebas Neue',
    textTransform: "uppercase",
    fontSize: "4em",
    fontWeight: "bolder",
    display: "flex",
  },
  roleTitle: {
    marginTop: theme.spacing(1.5),
    height: "fill"
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
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.youAreThe}>
            { props.introText }
          </Typography>
          <Typography className={classes.role} variant="h3">
            <Avatar className={classes.avatar} src={`role/${ props.card.cardImage }.png`} />
            <span className={classes.roleTitle}>{ props.card.title }</span>
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
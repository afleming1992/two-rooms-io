import React from 'react';
import { Card as RoleCard } from '../../domain/Card';
import {Card, CardActionArea, CardContent, CardMedia, Container, makeStyles, Typography} from "@material-ui/core";

interface CardViewProps {
  card: RoleCard | undefined
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    display: 'flex'
  },
  details: {
    display: 'flexi',
    flexDirection: 'column'
  },
  roleTitle: {
    textTransform: "uppercase"
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

const CardView: React.FC<CardViewProps> = (props) => {
  const classes = useStyles();

  return (
    <Container>
      {
        props.card !== undefined &&
        <Card className={classes.root} raised>
          <CardMedia
            className={classes.cover}
            image={`cards/${props.card.cardImage}.png`}
            title={ props.card.title }
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography>
                You are the
              </Typography>
              <Typography className={classes.roleTitle} variant="h5" component="h5">
                { props.card.title }
              </Typography>
              <Typography>
                { props.card.team }
              </Typography>
              <Typography>
                { props.card.howToWin }
              </Typography>
            </CardContent>
          </div>
        </Card>
      }
    </Container>
  );
}

export default CardView;
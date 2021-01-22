import React from 'react';
import {User} from "../domain/User";
import {makeStyles, Paper, Typography} from "@material-ui/core";
import {getPlayerByToken} from "../utils/player";
import CardShareTypeAvatar from "./CardShareTypeAvatar";
import {CardReveal} from "../domain/CardReveal";
import {CardShareType} from "../domain/Sharing";

interface PlayerRevealsProps {
  players: User[],
  reveals: any,
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    padding: theme.spacing(2),
    justifyContent: 'flex-start'
  },
  role: {
    flexGrow: 1
  },
  text: {
    flexGrow: 11,
    display: 'flex',
    flexDirection: "column",
    justifyContent: 'center'
  },
  room: {
    flexGrow: 1
  },
  roleName: {
    fontFamily: "Bebas Neue",
    fontSize: "1.5em"
  }
}))

const PlayerReveals: React.FC<PlayerRevealsProps> = (props) => {
  const classes = useStyles();

  return (
    <>
      {
        props.reveals.map( (reveal: CardReveal) => {
          const player = getPlayerByToken( reveal.player, props.players )

          return (
            <Paper className={classes.root}>
              <div className={classes.role}>
                <CardShareTypeAvatar card={reveal.card} type={CardShareType.ROLE} player={player} />
              </div>
              <div className={classes.text}>
                <Typography>{player?.name}</Typography>
                <Typography className={classes.roleName}>{reveal.card.title}</Typography>
              </div>
              <div className={classes.room}>

              </div>
            </Paper>
          );
        })
      }
    </>
  )
}

export default PlayerReveals;
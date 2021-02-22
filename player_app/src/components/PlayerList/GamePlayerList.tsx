import React from 'react';
import PlayerList from "./PlayerList";
import {User} from "../../domain/User";
import PlayerListItem from "./PlayerListItem";
import {Grid, makeStyles, Paper, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface GamePlayerListProps {
  players: Array<User> ,
  host?: User | undefined,
  currentPlayer: string | undefined,
  inverse?: boolean
  roomLeader: User | undefined,
  hostages: Array<User>,
  currentRoom: boolean
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1)
  }
}));

const GamePlayerList: React.FC<GamePlayerListProps> = ({roomLeader, hostages, currentPlayer, ...props}) => {
  const classes = useStyles();

  let playersMinusLeaderAndHostages = props.players;
  if( roomLeader ) {
    playersMinusLeaderAndHostages = playersMinusLeaderAndHostages.filter((player) => roomLeader.userToken !== player.userToken);
  }

  if( hostages.length > 0 ) {
    playersMinusLeaderAndHostages = playersMinusLeaderAndHostages.filter((player) => {
      hostages.map((hostage) => {
        if( hostage.userToken === player.userToken ) {
          return false;
        }
      });
      return true;
    })
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle1">
              Room Leader
            </Typography>
            {
              ((roomLeader) => {
                if(roomLeader) {
                  return (
                    <PlayerListItem
                      player={roomLeader}
                      inverse={true}
                      isMe={currentPlayer === roomLeader.userToken}
                    />
                  )
                } else {
                  return (
                    <Alert variant="filled" severity="error">
                      <AlertTitle>
                        No Room Leader!
                      </AlertTitle>
                      You can nominate a leader here!
                    </Alert>
                  );
                }
              })(roomLeader)
            }
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle1">
              Hostages
            </Typography>
            {
              (() => {
                if(hostages.length > 0) {
                  hostages.map((hostage) => {
                    return (
                      <PlayerListItem player={hostage} inverse={false} />
                    )
                  })
                } else {
                  return (
                    <Alert variant="filled" severity="warning">
                      <AlertTitle>No Hostages!</AlertTitle>
                      The Room leader can nominate hostages in the Action <FontAwesomeIcon icon={faComments} /> Menu
                    </Alert>
                  )
                }
              })()
            }
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle2">
              Other Players in Room
            </Typography>
            <PlayerList
              inverse={true}
              currentPlayer={currentPlayer}
              host={props.host}
              players={playersMinusLeaderAndHostages || []} />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default GamePlayerList;
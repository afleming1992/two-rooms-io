import React from 'react';
import {User} from "../../domain/User";
import {Card} from "../../domain/Card";
import {Box, makeStyles, Typography} from "@material-ui/core";
import PlayerCard from "../PlayerCard";

interface RoleRevealProps {
  player: User,
  role: Card
}

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    margin: theme.spacing(2)
  },
  playerOn: {
    fontFamily: 'Lato, san-serif',
    textTransform: "uppercase"
  }
}));

const RoleReveal: React.FC<RoleRevealProps> = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <PlayerCard card={props.role} introText={`${props.player.name} is currently the`} />
    </Box>
  )
}

export default RoleReveal;
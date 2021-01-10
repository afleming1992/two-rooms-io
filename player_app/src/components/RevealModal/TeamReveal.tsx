import React from 'react';
import {getTeamDetails, Team} from "../../domain/Team";
import {User} from "../../domain/User";
import {Box, makeStyles, Typography} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TeamRevealProps {
  team: Team,
  player: User
}

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    margin: theme.spacing(2)
  },
  playerOn: {
    fontFamily: 'Lato, san-serif',
    textTransform: "uppercase",
  },
  teamTitle: (props: TeamRevealProps) => {
    return {
      fontFamily: 'Bebas Neue',
      textTransform: "uppercase",
      fontSize: "4em",
      fontWeight: "bolder",
      backgroundColor: getTeamDetails(props.team).color,
      padding: "5px",
      borderRadius: "5px",
      maxWidth: "300px",
      marginTop: theme.spacing(3),
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
}));

const TeamReveal: React.FC<TeamRevealProps> = (props) => {
  const classes = useStyles(props);

  const teamDetails = getTeamDetails(props.team);

  return (
      <Box className={classes.root}>
        <Typography className={classes.playerOn} variant="subtitle1">
          { props.player.name } is currently on the
        </Typography>
        <Typography className={classes.teamTitle} variant="subtitle1">
          <FontAwesomeIcon icon={teamDetails.icon} /> { teamDetails.text }
        </Typography>
      </Box>
  );
}

export default TeamReveal;

import React from 'react';
import { faBomb, faCircle, faQuestionCircle, faStar, faTrophy, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Chip, makeStyles} from '@material-ui/core';
import {Team} from "../domain/Team";

interface TeamChipProps {
  team: Team
}

interface TeamDetails {
  color: string,
  icon: IconDefinition,
  text: string
}

const teamDetails: Map<Team, TeamDetails> = new Map<Team, TeamDetails>([
  [ Team.BLUE, {color: "#3C55A6", icon: faStar, text: "Blue Team"} ],
  [ Team.RED, { color: "#ED212C", icon: faBomb, text: "Red Team"} ],
  [ Team.GREY, { color: "#959494", icon: faQuestionCircle, text: "Grey Team"} ],
  [ Team.PURPLE, { color: "#765CA8", icon: faQuestionCircle, text: "??? Team" } ],
  [ Team.GREEN, { color: "#5EA640", icon: faTrophy, text: "Green Team" } ],
]);

const getTeamDetails = (team: Team) => {
  return teamDetails.get(team) || { color: "#959494", icon: faCircle, text: "Loading..." }
}

const useStyles = makeStyles((theme) => ({
  root: (props: TeamChipProps) => {
    return {
      backgroundColor: getTeamDetails(props.team).color
    }
  }
}));

const TeamChip: React.FC<TeamChipProps> = (props) => {
  const classes = useStyles(props);
  const icon = getTeamDetails(props.team).icon;
  const text = getTeamDetails(props.team).text;

  return (
    <Chip className={classes.root} icon={<FontAwesomeIcon icon={icon} size="lg" />} label={text} />
  );
}

export default TeamChip;
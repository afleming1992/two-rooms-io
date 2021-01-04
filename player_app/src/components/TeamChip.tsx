import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Chip, makeStyles} from '@material-ui/core';
import {getTeamDetails, Team} from "../domain/Team";

interface TeamChipProps {
  team: Team
  label?: string
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
  let label = getTeamDetails(props.team).text;

  if( props.label ) {
    label = props.label
  }

  return (
    <Chip className={classes.root} icon={<FontAwesomeIcon icon={icon} size="lg" />} label={label} />
  );
}

export default TeamChip;
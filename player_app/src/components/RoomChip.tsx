import React from 'react';
import {RoomName} from "../domain/Room";
import {makeStyles, Typography} from "@material-ui/core";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RoomChipProps {
  room: RoomName
}

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Bebas Neue',
    textTransform: "uppercase",
    fontWeight: "bolder",
  }
}));

const RoomChip: React.FC<RoomChipProps> = (props) => {
  const classes = useStyles();


  switch(props.room) {
    case RoomName.EAST_WING:
      return (
        <Typography className={classes.root} variant="h3">
          <FontAwesomeIcon icon={faDoorOpen} size={"lg"} /> EAST WING
        </Typography>
      );
    case RoomName.WEST_WING:
      return (
        <Typography className={classes.root} variant="h3">
          WEST WING <FontAwesomeIcon icon={faDoorOpen} size={"lg"} flip="horizontal" />
        </Typography>
      );
  }
}

export default RoomChip;
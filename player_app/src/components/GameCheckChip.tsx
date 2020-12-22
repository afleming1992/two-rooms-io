import React from 'react';
import {Chip, makeStyles, Theme} from "@material-ui/core";
import {green, red} from "@material-ui/core/colors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons';

interface GameCheckChip {
  currentNumber?: number,
  requiredNumber?: number,
  label?: string,
  icon?: React.ReactElement | undefined
}

const useStyles = makeStyles( (theme: Theme) => ({
  wrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  chip: {
    color: theme.palette.text.primary
  },
  check: {
    background: theme.palette.secondary.main
  },
  passedCheck: {
    backgroundColor: green[500]
  },
  failedCheck: {
    backgroundColor: red[900]
  }
}));

const GameCheckChip: React.FC<GameCheckChip> = (props) => {
  const classes = useStyles();

  let classToUse = classes.check;
  let iconToUse;

  if( props.currentNumber === undefined ) {
    props.currentNumber = 0;
  }

  if( props.requiredNumber && props.requiredNumber > 0 ) {
    if ( props.currentNumber >= props.requiredNumber ) {
      classToUse = classes.passedCheck
      iconToUse = <FontAwesomeIcon icon={faCheck} />
    } else {
      classToUse = classes.failedCheck
      iconToUse = <FontAwesomeIcon icon={faExclamation} />
    }
  }

  const label = `${props.requiredNumber !== undefined ? `${props.currentNumber}/${props.requiredNumber}` : `${props.currentNumber}`} ${props.label !== undefined ? props.label : ""}`;

  return (
    <div className={classes.wrapper}>
      <Chip className={classToUse} clickable={false} size="medium" icon={ props.icon } label={label} deleteIcon={iconToUse} onDelete={ () => {} }/>
    </div>
  );
}

export default GameCheckChip;
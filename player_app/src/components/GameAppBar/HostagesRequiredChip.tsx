import React from 'react';
import Round from "../../domain/Round";
import {Chip} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

interface HostagesRequiredChipProps {
  roundData: Round[] | undefined
  currentRound: number | undefined
}

const HostagesRequiredChip: React.FC<HostagesRequiredChipProps> = ({roundData, currentRound}) => {
  let roundKey =  0;
  if(currentRound) {
    roundKey = currentRound - 1;
  }

  if ( roundData && currentRound ) {
    return <Chip icon={<FontAwesomeIcon icon={faExchangeAlt} size="2x"/>} label={`${roundData[roundKey].hostagesRequired} Hostages`} />
  } else {
    return <></>
  }
};

export default HostagesRequiredChip;
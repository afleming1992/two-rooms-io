import React from 'react';
import GameEvent from "../../domain/GameEvent";
import {Card} from "@material-ui/core";

interface ShareEventProps {
  event: GameEvent
}

const ShareEvent: React.FC<ShareEventProps> = (props) => {
  return (
    <Card>

    </Card>
  );
}

export default ShareEvent;
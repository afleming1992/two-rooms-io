import React from 'react';
import GameEvent from "../../domain/GameEvent";
import {Card} from "@material-ui/core";
import ShareEvent from "./ShareEvent";

interface ShareEventProps {
  event: GameEvent
}

const RevealEvent: React.FC<ShareEventProps> = () => {
  return (
    <Card>

    </Card>
  );
}

export default ShareEvent;
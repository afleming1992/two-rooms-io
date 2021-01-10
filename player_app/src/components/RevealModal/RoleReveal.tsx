import React from 'react';
import {User} from "../../domain/User";
import {Card} from "../../domain/Card";

interface RoleRevealProps {
  player: User,
  role: Card
}

const RoleReveal: React.FC<RoleRevealProps> = (props) => {
  return (
    <>Role Reveal</>
  )
}

export default RoleReveal;
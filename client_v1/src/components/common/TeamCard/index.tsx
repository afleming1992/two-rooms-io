import React from 'react';
import {Team} from "../../../domain/Team";
import {Image} from 'semantic-ui-react';

interface TeamCardProps {
    team: Team
}

const TeamCard = ({ team } : TeamCardProps ) => {
    let teamImage = "";
    switch( team ) {
        case Team.BLUE:
            teamImage = "teams/blue.png"
            break;
        case Team.RED:
            teamImage = "teams/red.png"
            break;
        case Team.GREY:
            teamImage = "teams/grey.png"
            break;
        case Team.GREEN:
            teamImage = "teams/green.png"
            break;
        case Team.PURPLE:
            teamImage = "teams/purple.png"
            break;
    }

    return (
        <Image src={teamImage} />
    )
}

export default TeamCard;
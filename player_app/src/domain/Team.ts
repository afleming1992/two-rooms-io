import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {faBomb, faCircle, faQuestionCircle, faStar, faTrophy } from "@fortawesome/free-solid-svg-icons";

export enum Team {
    BLUE = "BLUE",
    RED = "RED",
    GREY = "GREY",
    PURPLE = "PURPLE",
    GREEN = "GREEN"
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

export const getTeamDetails = (team: Team) => {
    return teamDetails.get(team) || { color: "#959494", icon: faCircle, text: "Loading..." }
}
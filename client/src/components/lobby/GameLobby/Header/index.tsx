import React, { useState } from 'react';
import {Button, GridColumn, Progress} from "semantic-ui-react";
import {GameState} from "../../../../redux/reducers/game";

interface HeaderProps {
    game: GameState
}

export const Header = ({game, ...props}: HeaderProps) => {
    let canStart = false;
    let numberOfPlayers;
    let requiredPlayers;
    if ( game.deck != undefined && game.players != undefined ) {
        numberOfPlayers = game.players.length;
        requiredPlayers = game.deck.length;
        canStart = numberOfPlayers == requiredPlayers;
    }

    return (
        <>
            <h1>{ canStart ? "Ready to Start!" : "Waiting for Players..."}</h1>
            <Progress success={canStart} value={numberOfPlayers} total={requiredPlayers} progress='ratio' autoSuccess />
        </>
    );
}
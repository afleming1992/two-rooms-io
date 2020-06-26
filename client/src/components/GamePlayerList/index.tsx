import React from 'react';
import {User} from "../../domain/User";
import {Button, ButtonGroup, Image, List, Segment, SegmentGroup} from "semantic-ui-react";

interface GamePlayerListProps {
    players: Array<User>
}

const GamePlayerList = ({players} : GamePlayerListProps) => {
    return (
        <List divided verticalAlign='middle' relaxed>
            {
                players.map( (player) => {
                    return (
                    <List.Item>
                        <List.Content floated="right">
                            <ButtonGroup size="large">
                                <Button>Share</Button>
                                <Button>Reveal</Button>
                            </ButtonGroup>
                        </List.Content>
                        <Image avatar src={`https://api.adorable.io/avatars//${player.userToken}.png`} />
                        <List.Content>{player.name}</List.Content>
                    </List.Item>
                    )
                })
            }
        </List>
    );
}

export default GamePlayerList;
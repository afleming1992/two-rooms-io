import React from "react";
import {List, Segment, Image, Header, Button, Label, Card, ButtonGroup} from "semantic-ui-react";
import {User} from "../../domain/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserFriends} from "@fortawesome/free-solid-svg-icons";

interface PlayerListProps {
    showHostControls: boolean,
    players: Array<User>
}

export const PlayerList = ({showHostControls, players, ...props}: PlayerListProps) => {

    return (
        <Segment.Group raised>
            <Segment>
                <Label size='big' color='teal' ribbon>
                    Players <FontAwesomeIcon icon={ faUserFriends } />
                </Label>
            </Segment>
            <Segment>
                <List divided verticalAlign='middle'>
                    { players.map( (player ) => {
                        return <Player showHostControls={showHostControls} player={player} />
                    } ) }
                </List>
            </Segment>
        </Segment.Group>
    )
}

interface PlayerProps {
    showHostControls: boolean
    player: User
}

export const Player = ({player, showHostControls} : PlayerProps) => {
    return (
        <List.Item>
            <List.Content floated='right'>
                <ButtonGroup size="tiny">
                    <Button>Kick</Button>
                </ButtonGroup>
            </List.Content>
            <Image avatar src={`https://api.adorable.io/avatars//${player.userToken}.png`} />
            <List.Content>{player.name}</List.Content>
        </List.Item>
    )
}
import React from 'react';
import {User} from "../../../domain/User";
import {
    Button,
    ButtonGroup,
    Image,
    List,
    Segment,
    SegmentGroup,
    Item,
    Card,
    Icon,
    Responsive,
    Grid
} from "semantic-ui-react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Action} from "typesafe-actions";
import { bindActionCreators } from 'redux';
import PlayerActions from "../PlayerActions";
import PlayerCard from "../../common/PlayerCard";
import {CardState} from "../../../redux/reducers/card";

interface GamePlayerListProps {
    activePlayer: User,
    players: Array<User>,
    playerCard: CardState
}

const GamePlayerList = ({activePlayer, players, playerCard} : GamePlayerListProps) => {
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <PlayerActions />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column width={12}>
                    <Card.Group>
                        <Card fluid>
                            <Card.Content>
                                <Item.Group unstackable>
                                    {
                                        players.map( (player) => {
                                            const isActivePlayer = activePlayer.userToken === player.userToken;
                                            return (
                                                <Item>
                                                    <Responsive as={Item.Image} minWidth={768} src={`https://api.adorable.io/avatars//${player.userToken}.png`} size="mini" />
                                                    <Item.Content verticalAlign='middle'>
                                                        <Item.Header>{ player.name }</Item.Header>
                                                    </Item.Content>
                                                </Item>
                                            )
                                        })
                                    }
                                </Item.Group>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <PlayerCard card={playerCard.card == undefined ? undefined : playerCard.card}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
    bindActionCreators( {

    }, dispatch);

export default connect()(GamePlayerList);
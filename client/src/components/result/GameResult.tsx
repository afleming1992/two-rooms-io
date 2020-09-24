import React from 'react';
import {Image, Card, CardGroup, Container, Grid, Header, Segment} from "semantic-ui-react";
import Logo from "../logo";
import {faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {User} from "../../domain/User";
import { Card as TwoRoomsCard } from "../../domain/Card";
import {connect} from "react-redux";

interface GameResultProps {
    players: User[],
    revealedCardAssignments: any
}

const GameResult = ({players, revealedCardAssignments} : GameResultProps) => {
    return (
        <Container className="padding-top">
            <Grid centered rows={2}>
                <Grid.Row columns={1} textAlign="center">
                    <Segment>
                        <Header size={"huge"}><FontAwesomeIcon icon={faTrophy} />&nbsp;&nbsp;The Results</Header>
                    </Segment>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <CardGroup itemsPerRow={8}>
                            {
                                players.map( player => {
                                    let cardImage = '/cards/card_back.png';
                                    if( player.userToken !== undefined && revealedCardAssignments !== undefined ) {
                                        const revealedCard: TwoRoomsCard | undefined = revealedCardAssignments[player.userToken];
                                        if( revealedCard !== undefined ) {
                                            cardImage = `/cards/${ revealedCard.cardImage }.png`
                                        }
                                    }

                                    return ( <Card>
                                        <Image src={cardImage} />
                                        <Card.Content textAlign="center">
                                            <Card.Header>
                                                { player.name }
                                            </Card.Header>
                                        </Card.Content>
                                    </Card> );
                                    }
                                )
                            }
                        </CardGroup>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state: any) => {
    return {
        players: state.game.players,
        revealedCardAssignments: state.game.revealedCardAssignments
    }
}

export default connect(mapStateToProps)(GameResult);
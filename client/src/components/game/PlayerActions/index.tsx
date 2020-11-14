import React, {useState} from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import {Action} from "typesafe-actions";
import {connect} from "react-redux";
import {
    Button,
    ButtonGroup,
    Icon,
    Select,
    Grid,
    Header,
    Segment
} from "semantic-ui-react";
import {User} from "../../../domain/User";
import {faPalette, faUserTie} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PlayerState} from "../../../redux/reducers/player";
import actionCreators from "../../../redux/actions/creators";
import {CardShareType} from "../../../domain/Sharing";

interface PlayerActionsProps {
    players: User[] | undefined,
    activePlayer: PlayerState,
    requestShare: any,
    privateReveal: any,
    gameLive: boolean
}

enum PlayerActionsView {
    ACTIONS,
    TYPE,
    PLAYER_SELECT
}

enum ActionType {
    NONE,
    LEADER= "Nominate Leader",
    SHARE = "Share",
    REVEAL = "Reveal",
    USURP = "Usurp Vote",
    HOSTAGE = "Choose Hostage"
}

const PlayerActions = ({players, activePlayer, requestShare, privateReveal, gameLive, ...props}: PlayerActionsProps) => {
    const [ view, setView ] = useState( PlayerActionsView.ACTIONS )
    const [ action, setAction ] = useState( ActionType.NONE )
    const [ type, setType ] = useState( CardShareType.NONE )
    const [ selectedPlayer, setSelectedPlayer ] = useState( "" );

    const onShareAction = () => {
        setAction( ActionType.SHARE );
        setView( PlayerActionsView.TYPE );
    }

    const onRevealAction = () => {
        setAction( ActionType.REVEAL );
        setView( PlayerActionsView.TYPE );
    }

    const onNominateLeader = () => {
        setAction( ActionType.LEADER );
        setView( PlayerActionsView.PLAYER_SELECT );
    }

    const onUsurpLeader = () => {
        setAction( ActionType.USURP );
        setView( PlayerActionsView.PLAYER_SELECT );
    }

    const onTypeSelect = ( type: CardShareType ) => {
        setType( type );
        setView( PlayerActionsView.PLAYER_SELECT );
    }

    const reset = () => {
        setView( PlayerActionsView.ACTIONS );
        setAction( ActionType.NONE );
        setType( CardShareType.NONE );
        setSelectedPlayer( "" );
    }

    const onPlayerChange = (event: any, data: any) => {
        setSelectedPlayer(data.value);
    }

    const onSubmit = () => {
        switch( action ) {
            case ActionType.REVEAL:
                privateReveal( type, selectedPlayer);
                break;
            case ActionType.SHARE:
                requestShare( type, selectedPlayer);
                break;
            case ActionType.LEADER:
                break;
            case ActionType.USURP:
                break;
            case ActionType.HOSTAGE:
                break;
        }

        reset();
    }

    return (
        <div id="playerActions">
            {
                view == PlayerActionsView.ACTIONS &&
                <>
                <Segment disabled={!gameLive}>
                  <Button.Group fluid>
                    <Button disabled={!gameLive} color="teal" onClick={onShareAction}><Icon name="share square" />Share</Button>
                    <Button disabled={!gameLive} color="orange" onClick={onRevealAction}><Icon name="eye" />Reveal</Button>
                  </Button.Group>
                </Segment>

                </>
            }
            {
                view == PlayerActionsView.TYPE &&
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} textAlign="center" verticalAlign="middle"><Header size="small">{action}</Header></Grid.Column>
                        <Grid.Column width={10} textAlign="center" verticalAlign="middle">
                            <ButtonGroup fluid>
                              <Button color="blue" onClick={ () => onTypeSelect(CardShareType.COLOUR)}><FontAwesomeIcon icon={faPalette} /> Colour</Button>
                              <Button color="blue" onClick={ () => onTypeSelect(CardShareType.ROLE)}><FontAwesomeIcon icon={faUserTie} /> Role</Button>
                            </ButtonGroup>
                        </Grid.Column>
                        <Grid.Column width={3} textAlign="center" verticalAlign="middle"><Button inverted color="red" onClick={reset}><Icon name="remove" /> Cancel</Button></Grid.Column>
                    </Grid.Row>
                </Grid>
            }
            {
                view == PlayerActionsView.PLAYER_SELECT &&
                <Grid>
                   <Grid.Row>
                       <Grid.Column width={3} textAlign="center" verticalAlign="middle"><Header size="tiny">{ action } { type !== CardShareType.NONE ? type : "" } with: </Header></Grid.Column>
                       <Grid.Column width={8} textAlign="center"><Select fluid placeholder='Select a player' onChange={onPlayerChange} options={playersToOptions(players, activePlayer)} /></Grid.Column>
                       <Grid.Column width={5} textAlign="center"><ButtonGroup>
                         <Button color="green" onClick={ onSubmit } disabled={ selectedPlayer === ""}>Confirm</Button>
                         <Button inverted color="red" onClick={reset}><Icon name="remove" /> Cancel</Button>
                       </ButtonGroup></Grid.Column>
                   </Grid.Row>
                </Grid>
            }
        </div>
    )
}

const playersToOptions = ( players: User[] | undefined, activePlayer: PlayerState) => {
    let list: { key: string | undefined; value: string | undefined; text: string | undefined; }[] = [];

    if( players !== undefined ) {
        players.forEach( (player) => {
            if ( player.userToken !== activePlayer.userToken && player.name !== activePlayer.name ) {
                list.push( {
                    key: player.userToken,
                    value: player.userToken,
                    text: player.name
                })
            }
        })
    }

    return list;
}


const mapStateToProps = (state: any) => {
    return {
        players: state.game.players,
        activePlayer: state.player,
        gameLive: state.timer.timerRunning
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
    requestShare: actionCreators.requestShare,
    privateReveal: actionCreators.privateReveal
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PlayerActions);
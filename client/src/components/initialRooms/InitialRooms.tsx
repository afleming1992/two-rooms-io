import React, {Dispatch} from "react";
import {connect} from "react-redux";
import {Container, Grid} from "semantic-ui-react";
import RoomList from "../common/RoomList";
import {RoomState} from "../../redux/reducers/room";
import {RoomName} from "../../domain/RoomName";

interface InitialRoomAllocations {
    roomState: RoomState
}

const InitialRoomsAllocation = ({roomState} : InitialRoomAllocations) => {
    let loading = false;
    let alphaRoom = undefined;
    let omegaRoom = undefined;

    if ( roomState.rooms == undefined ) {
        loading = true;
    } else {
        alphaRoom = roomState.rooms[RoomName.ALPHA]
        omegaRoom = roomState.rooms[RoomName.OMEGA]
    }

    return (
        <Container className="padding-top">
            <Grid columns="equal">
                <Grid.Row padded>
                    <Grid.Column textAlign="center">`
                        <h1>Starting Rooms</h1>
                    </Grid.Column>
                </Grid.Row>
                {
                    loading &&
                    <Grid.Row>
                      Loading...
                    </Grid.Row>
                }
                {
                    !loading &&
                    <Grid.Row columns={2}>
                      <Grid.Column textAlign="center">
                        <RoomList room={alphaRoom} />
                      </Grid.Column>
                      <Grid.Column textAlign="center">
                        <RoomList room={omegaRoom} />
                      </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state: any) => {
    return {
        roomState: state.room
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialRoomsAllocation);
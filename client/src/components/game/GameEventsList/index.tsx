import React from "react";
import { Dispatch, bindActionCreators } from "redux";
import {connect} from "react-redux";
import {Action} from "typesafe-actions";
import {Grid, Segment} from "semantic-ui-react";
import PendingEvents from "./PendingEvents";
import MyEvents from "./MyEvents";

const GameEventList = () => {
    return (
        <Grid columns={2}>
            <Grid.Column>
                <PendingEvents />
            </Grid.Column>
            <Grid.Column>
                <MyEvents />
            </Grid.Column>
        </Grid>
    )
}

const mapStateToProps = (state: any) => {
    return {

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
    bindActionCreators({

    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameEventList);
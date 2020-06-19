import React, {Dispatch} from "react";
import {connect} from "react-redux";
import {Container, Grid} from "semantic-ui-react";
import {ViewState} from "../../redux/reducers/view";
import RoundTimer from "../Timer";

interface RootGameProps {
    view: ViewState
}

const RootGame = ({view, ...props}: RootGameProps) => {
    return (
        <Container className="padding-top">
            <Grid>
                <RoundTimer />
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state: any) => {
    return {
        view: state.view
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootGame);
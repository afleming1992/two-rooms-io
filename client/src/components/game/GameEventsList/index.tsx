import React from "react";
import { Dispatch, bindActionCreators } from "redux";
import {connect} from "react-redux";
import {Action} from "typesafe-actions";

const GameEventList = () => {
    return (
        <></>
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
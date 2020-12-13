import React from 'react';
import {Action, bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";

interface HostControlProps {

}

const HostControl: React.FC<HostControlProps> = () => {
  return (<></>);
}

const mapStateToProps = (state: any) => {
    return {

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators({

  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostControl)
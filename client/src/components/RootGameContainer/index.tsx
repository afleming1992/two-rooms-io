import React, {ReactComponentElement, ReactNode} from 'react';
import {Container} from "semantic-ui-react";
import HostControl from "../HostMenuBar";

interface RootGameContainerProps {
    isHost: boolean,
    children: ReactNode
}

const RootGameContainer = ({isHost, children} : RootGameContainerProps) => {
    return (
        <div>
            {
                isHost &&
                <HostControl />
            }
            {children}
        </div>
    );
}

export default RootGameContainer;
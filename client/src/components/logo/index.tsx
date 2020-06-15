import React from 'react';
import {Header} from "semantic-ui-react";
import './index.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

export const Logo = () => {
    return (
        <>
            <div className="header">
                <h1>Two Rooms and a <FontAwesomeIcon icon={faBomb} /></h1>
            </div>
            <hr />
        </>
    )
}

export default Logo;
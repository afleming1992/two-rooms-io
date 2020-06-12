import React from 'react';
import {Button, Form} from "semantic-ui-react";

interface PlayerLoginFormProps {
    onJoining(event: any) : void,
    onChange(event: any) : void,
    joining: boolean
}

const PlayerLoginForm = ({joining, onJoining, onChange, ...props}: PlayerLoginFormProps) => {
    return (
        <>
            <br />
            <Form onSubmit={onJoining} loading={joining} size="big">
                <Form.Input required placeholder='Name' name='name' onChange={onChange} />
                <Button color="green" size="big" type='submit'>Join</Button>
            </Form>
        </>
    );
}

export default PlayerLoginForm;
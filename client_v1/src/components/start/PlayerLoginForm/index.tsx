import React from 'react';
import {Button, Form, Message} from "semantic-ui-react";

interface PlayerLoginFormProps {
    errors: any
    onJoining(event: any) : void,
    onChange(event: any) : void,
    joining: boolean
}

const PlayerLoginForm = ({errors, joining, onJoining, onChange, ...props}: PlayerLoginFormProps) => {
    return (
        <>
            <br />
            <Form error={ errors.error !== {} ? true : false } onSubmit={onJoining} loading={joining} size="big">
                {
                    errors && errors.error &&
                    <Message
                      error
                      header='There was a problem!'
                      content={errors.error}
                    />
                }
                <Form.Input required placeholder='Name' name='name' onChange={onChange} />
                <Button color="green" size="big" type='submit'>Join</Button>
            </Form>
        </>
    );
}

export default PlayerLoginForm;
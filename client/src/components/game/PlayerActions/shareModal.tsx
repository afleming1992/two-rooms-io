import React, {useState} from 'react';
import {
    Button,
    DropdownItemProps,
    Form,
    FormGroup,
    Modal,
} from "semantic-ui-react";
import {User} from "../../../domain/User";

interface ShareModalProps {
    open: boolean,
    players: User[] | undefined
}

const ShareModal = ({players, open}: ShareModalProps) => {
    const playerOptions = players == undefined ? [] : convertPlayersToOptions(players);

    const shareOptions:DropdownItemProps[] = [
        {key: "colour", value: "colour", text: "Colour"},
        {key: "role", value: "role", text: "Role"}
    ]

    return (
        <Modal open={open} closeIcon>
            <Modal.Header>Share your Card</Modal.Header>
            <Modal.Content>
                <p>Request to see another players card information. If they agree, you both will share this information with each other.</p>
                <br />
                <Form>
                    <FormGroup>
                        <Form.Field width={8}>
                            <label>Type</label>
                            <Form.Select placeholder="What do you want to share?" options={shareOptions} />
                        </Form.Field>
                        <Form.Field width={8}>
                            <label>Player</label>
                            <Form.Select placeholder="With who?" options={playerOptions} />
                        </Form.Field>
                    </FormGroup>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative>Cancel</Button>
                <Button positive>
                    Send Request
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

function convertPlayersToOptions(players: User[]) {
    let list: { "key": string | undefined; "value": string | undefined; "text": string | undefined; }[] = [];

    players.forEach((player) => {
       list.push({
           "key": player.userToken,
           "value": player.userToken,
           "text": player.name
       })
    });

    return list;
}

export default ShareModal;
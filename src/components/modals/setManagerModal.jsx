import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useErrorHandler } from "react-error-boundary";
import { userToGroupContext } from "../../App";
import { serverURL } from "../../config/config";
import { Modal, Button, Dropdown, FormControl } from "react-bootstrap";
import axios from 'axios';
export const SetManagerModal = (props) => {
    const [users, setUsers] = useState([]);
    const [selectValue, setSelectValue] = useState('');
    const [value, setValue] = useState('');
    const [afterSubmitAlert, setAfterSubmitAlert] = useState(false);
    const errorHandler = useErrorHandler();
    const { userToGroup } = useContext(userToGroupContext);
    const handleClose = () => { props.setShowManagerAlert(false); };

    useEffect(() => {
        try {
            if (props.group && props.group.id) {
                axios.get(`${serverURL}api/UsersToGroups`, {
                    params: {
                        groupId: props.group.id
                    }
                }).then(result => {
                    if (result.data && result.data.length) {
                        setUsers(result.data.map(u => ({ id: u.id, description: `${u.name ? u.name : ''} (${u.email})` })));
                    }
                })
            }


        }
        catch (error) {
            errorHandler(error);
        }
    }, []);
    const submit = () => {
        try {
            axios.post(`${serverURL}group/setManager/${selectValue.id}`, props.group);
            setAfterSubmitAlert(true);
        }
        catch (err) {
            errorHandler(err);
        }
    }
    return (
        users.length && <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Set Manager</Modal.Title>
            </Modal.Header>
            <Modal.Body>Choose another manager from group</Modal.Body>
            <Modal.Footer style={{ justifyContent: "space-between" }}>
                <Dropdown onSelect={(eventKey) => { setSelectValue(JSON.parse(eventKey)) }}>
                    <Dropdown.Toggle variant="link" id="dropdown-custom-components" >
                        Choose anoter manager
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <FormControl
                            autoFocus
                            className="mx-3 my-2 w-auto"
                            placeholder="choose manager..."
                            onChange={(e) => setValue(e.target.value)}
                            value={value} />
                        {
                            users.length > 0 ?
                                users.filter(u => u.description.toLowerCase().startsWith(value.toLowerCase()))
                                    .map((element, index) =>
                                        <Dropdown.Item key={element.id} eventKey={JSON.stringify(element)} href="#">{element.description}</Dropdown.Item>) : ""
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <h5>{selectValue.description}</h5>

                {!afterSubmitAlert && <Button variant="primary" onClick={() => submit()} >Submit</Button>}
            </Modal.Footer>
            {afterSubmitAlert && <p style={{ textAlign: 'center' }}>we checked if <b>{selectValue.description}</b> agree to manage <br /><b>{props.group.name}</b> group<br />
                we send you email about his answer</p>}
        </Modal>
    );
}

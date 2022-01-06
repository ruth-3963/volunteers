import CSS_COLOR_NAMES from '../colors'
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
import serverUrl from '../serverURL'
import { useEffect, useContext } from 'react';
import { GroupContext, UserContext } from '../App.js'
import { useErrorHandler } from 'react-error-boundary';
const ChooseColor = (props) => {
    const errorHandler = useErrorHandler();
    const { group, setGroup } = useContext(GroupContext);
    const { user, setUser } = useContext(UserContext);
    const [value, setValue] = useState('');
    const [allGroupUsersColor, setAllGroupUsersColor] = useState([]);
    const handleClose = () => { props.setShow(false); };
    useEffect(async () => {
        try {
            const allUsersColors = await axios.get("" + serverUrl + "getAllUsersColors", {
                params: {
                    groupId: props.group.id
                }
            });
            if (allUsersColors.data.length > 0) {
                const colorsWithFilter = CSS_COLOR_NAMES.filter(c => !allUsersColors.data.includes(c));
                setAllGroupUsersColor(colorsWithFilter);
            }
            else {
                setAllGroupUsersColor(CSS_COLOR_NAMES);
            }
        }
        catch (err) {
            errorHandler(err);
        }
    }, []);
    const submit = async () => {
        if (props.color) {
            try {
                const result = await axios.put("" + serverUrl + "api/usersToGroups", {
                    user_id: user.id, group_id: props.group.id, color: props.color
                });
                if (result.data) {
                    if (group.id === props.group.id)
                        localStorage.setItem("userToGroup", JSON.stringify(result.data));
                    if (props.setOwnerData)
                        props.setOwnerData([{ Id: user.id, OwnerColor: props.color, OwnerText: user.name }]);
                    else {
                        props.setChangeGroup(!props.changeGroup);
                    }
                    props.setShow(false);
                }
            }
            catch (err) {
                errorHandler(err);
            }
        }
    }

    return (<Modal show={props.showColorAlert} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>choose color</Modal.Title>
        </Modal.Header>
        <Modal.Body>choose color that identify you in the group</Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
            <Dropdown onSelect={(e) => props.setColor(e)}>
                <Dropdown.Toggle variant="link" id="dropdown-custom-components" >
                    Choose color
                </Dropdown.Toggle>
                <Dropdown.Menu >
                    <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="choose color..."
                        onChange={(e) => setValue(e.target.value)}
                        value={value} />
                    {
                        allGroupUsersColor.length > 0
                            ? allGroupUsersColor.filter(c => c.toLowerCase().startsWith(value)).map((element, index) => <Dropdown.Item eventKey={element} href="#">{element}
                                <div style={{ width: "3vh", height: "3vh", backgroundColor: element, display: "inline-block", float: "right" }}></div>
                            </Dropdown.Item>) : ""}
                </Dropdown.Menu>
            </Dropdown>
            <h3 style={{ color: props.color }}>{props.color}</h3>
            <Button variant="primary" onClick={() => submit()} disabled={!props.color}>Submit</Button>
        </Modal.Footer>
    </Modal>);
}
export default ChooseColor;
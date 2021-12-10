import CSS_COLOR_NAMES from '../colors'
import React, { useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
import serverUrl from '../serverURL'

const ChooseColor = (props) => {
    let localUser = JSON.parse(localStorage.getItem("user"));
    let localGroup = JSON.parse(localStorage.getItem("group"));
    const [value, setValue] = useState('');

    const submit = async () => {
        if (props.color) {
            const result = await axios.put("" + serverUrl + "api/usersToGroups", {
                user_id: localUser.id, group_id: localGroup.id, color: props.color
            });
            if (result.data) {
                localStorage.setItem("userToGroup", JSON.stringify(result.data));
                props.setShow(false);
                props.setOwnerData([{Id: localUser.id , OwnerColor: props.color ,OwnerText:localUser.name }]);
            }
        }
    }
    return (<Modal show={props.showColorAlert} >
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
                        value={value}
                    />{
                        CSS_COLOR_NAMES.filter(c => c.toLowerCase().startsWith(value)).map((element, index) => <Dropdown.Item eventKey={element} href="#">{element}
                            <div style={{ width: "3vh", height: "3vh", backgroundColor: element, display: "inline-block", float: "right" }}></div>
                        </Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
            <h3 style={{ color: props.color }}>{props.color}</h3>
            <Button variant="primary" onClick={() => submit()} disabled={!props.color}>Submit</Button>
        </Modal.Footer>
    </Modal>);
}
export default ChooseColor;
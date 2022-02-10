import CSS_COLOR_NAMES from '../../config/colors'
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import { Dropdown, Form } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
import {serverURL} from '../../config/config'
import { useEffect, useContext } from 'react';
import { GroupContext, UserContext } from '../../App.js'
import { useErrorHandler } from 'react-error-boundary';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import { useHistory } from 'react-router-dom';

const UserToGroupSettings = (props) => {
    const errorHandler = useErrorHandler();
    const { group } = useContext(GroupContext);
    const { user} = useContext(UserContext);
    const [searchValue , setSearchValue] = useState('');
    const [color, setColor] = useState(''); 
    const [reminder,setReminder] = useState(0.5);
    const [allGroupUsersColor, setAllGroupUsersColor] = useState([]);
    const history = useHistory();
    const [show,setShow] = useState(props.showSettingsAlert?props.showSettingsAlert:true);
    const handleClose = () => {
        setShow(false);
        if(props.setShow)  
            props.setShow(false); 
        else{
            history.push("/home");
        }
    };
    useEffect(async () => {
        try {
            const allUsersColors = await axios.get(serverURL + "getAllUsersColors", {
                params: {
                    groupId: props.group ? props.group.id : group.id
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
        if (color) {
            try {
                let colorTosubmit;
                let groupId = props.group ? props.group.id : group.id;
                try{
                    colorTosubmit =  convertCssColorNameToHex(color);
                }
                catch{
                    colorTosubmit = color;
                }
                const result = await axios.put(serverURL + "api/usersToGroups", {
                    user_id: user.id, 
                    group_id: groupId,
                    color: colorTosubmit,
                    reminder:reminder
                });
                if (result.data) {
                    if (group.id === groupId)
                        localStorage.setItem("userToGroup", JSON.stringify(result.data));
                    if (props.setOwnerData)
                        props.setOwnerData([{ Id: user.id, OwnerColor: props.color, OwnerText: user.name }]);
                    else {
                        if(props.setChangeGroup)
                        props.setChangeGroup(!props.changeGroup);
                    }
                   handleClose();
                }
            }
            catch (err) {
                errorHandler(err);
            }
        }
    }

    return (<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Settings to {group.name} group</Modal.Title>
        </Modal.Header>
        <Modal.Body><h5><u>choose color that identify you in the group</u></h5>
        <div style={{display:'flex' , justifyContent:'space-around'}}>
            <Dropdown onSelect={(e) => setColor(e)}>
                <Dropdown.Toggle variant="link" id="dropdown-custom-components" >
                    Choose color
                </Dropdown.Toggle>
                <Dropdown.Menu >
                    <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="choose color..."
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={color} />
                    {
                        allGroupUsersColor.length > 0
                            ? allGroupUsersColor.filter(c => c.toLowerCase().startsWith(searchValue)).map((element, index) => <Dropdown.Item eventKey={element} key={index} href="#">{element}
                                <div style={{ width: "3vh", height: "3vh", backgroundColor: element, display: "inline-block", float: "right" }}></div>
                            </Dropdown.Item>) : ""}
                </Dropdown.Menu>
            </Dropdown >
            <h3 style={{ color: color }}>{color}</h3></div> <hr/>
            <h5><u>Reminder before shift</u></h5>
            <p>We want to send you remember in email about volunter<br/>
           
            How match time before volunteer yo want get the Message</p>
            <Form.Label>Num of hours</Form.Label>
            <Form.Control min = '0.5' type="number" size="sm" value={reminder} onChange={(e) => setReminder(e.target.value)}/></Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={() => submit()} disabled={!color && !reminder}>Submit</Button>
        </Modal.Footer>
    </Modal>);
}
export default UserToGroupSettings;
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import serverURL from '../serverURL';
import { useLocation, useHistory } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BsFillPlusCircleFill } from "react-icons/bs";
import AddCircle from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { FormatAlignJustifyTwoTone } from '@material-ui/icons';
const container = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
}
const AddVolunteer = () => {

    const [volunteers, setVolunteers] = useState(new Array(10).fill(<Form.Control type="email" placeholder="Enter email" />));
    const location = useLocation();
    const history = useHistory();
    const formRef = useRef();
    const [group, setGroup] = useState();
    const localGroup = JSON.parse(localStorage.getItem("group"));
    const localUserToGroup = JSON.parse(localStorage.getItem("userToGroup"));
    const handleSubmit = (e) => {
        e.preventDefault();
        const arr = Array.prototype.slice.call(e.target.children[0].children);
        const volunteers = [];
        arr.map((chaild, index) => {
            if (chaild.value) {
                const email = chaild.value;
                volunteers.push(email);
            }
        });
        axios.post("" + serverURL + "AddUsers", {
            emails: volunteers,
            group: localGroup
        })
        formRef.current.reset();
    }
    return (<div className="auth-wrapper">
        <div className="auth-inner">
            <div>
                <h3 style={{ display: "inline-block" }}>Add Volunteers</h3>
                <Tooltip title="Add" aria-label="add">
                  
                        <AddCircle style={{float:"right"}}/>
                    
                </Tooltip></div>
            <Form ref={formRef} onSubmit={(e) => handleSubmit(e)}>

                <div className="mb-3">
                    {volunteers.map((element, index) => element)}
                </div>
                <Button type="submit" block >Add all and send email</Button>
            </Form>
        </div>
    </div>
    );
}
export default AddVolunteer;
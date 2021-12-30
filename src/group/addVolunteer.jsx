import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { Toast, ToastContainer } from 'react-bootstrap';
import serverURL from '../serverURL';
import { useLocation, useHistory } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BsFillPlusCircleFill } from "react-icons/bs";
import AddCircle from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useContext } from 'react';
import { GroupContext } from '../App';

const AddVolunteer = () => {

    const [volunteers, setVolunteers] = useState(new Array(10).fill(<Form.Control key="1" type="email" placeholder="Enter email" />));
    const formRef = useRef();
    const { group, setGroup } = useContext(GroupContext)
    const [showToast, setShowToast] = useState(false);
    const [addedUsers, setAddedUsers] = useState([]);
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
        if (!volunteers.length) return;
        axios.post("" + serverURL + "AddUsers", {
            emails: volunteers,
            group: group
        }).then(result => { if (result.data){setAddedUsers(result.data); setShowToast(true) } })
        formRef.current.reset();
    }
    return (<div className="auth-wrapper">
        <div className="auth-inner">
            <div>
                <ToastContainer style={{ position: 'relative' }} className="p-3" position="top-end">
                    <Toast onClose={() => setShowToast(false)} show={showToast}  delay={9000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <strong>You have successfully added the following users:</strong><br/> 
                            {addedUsers.map((item, step) =>
                                <><span key={step} >{item} </span><br/></>
                                    
                            )}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
                <h3 style={{ display: "inline-block" }}>Add Volunteers</h3>
                <Tooltip title="Add" aria-label="add">
                    <AddCircle style={{ float: "right" }} />
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
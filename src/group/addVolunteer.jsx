import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import {Button,CloseButton} from 'react-bootstrap';
import { useErrorHandler } from 'react-error-boundary';
import Form from 'react-bootstrap/Form';
import { Toast } from 'react-bootstrap';
import ToastContainer from "react-bootstrap/ToastContainer"
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
    const history = useHistory();
    const errorHandler = useErrorHandler();
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
        }).then(result => {  if (result.data){setAddedUsers(result.data); setShowToast(true) } })
          .catch(error => errorHandler(error))
        formRef.current.reset();
    }
    return (<div className="auth-wrapper">
        <div className="auth-inner">
        <CloseButton onClick={() => history.goBack()}/>

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
                <h3 >Add Volunteers
                <Tooltip title="Add" aria-label="add">
                    <AddCircle style={{ float: "right" }} />
                </Tooltip></h3></div>
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
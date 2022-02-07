import axios from 'axios';
import React, { useState, useRef } from 'react';
import { Button, CloseButton } from 'react-bootstrap';
import { useErrorHandler } from 'react-error-boundary';
import Form from 'react-bootstrap/Form';
import { Toast } from 'react-bootstrap';
import ToastContainer from "react-bootstrap/ToastContainer"
import {serverURL} from '../../config/config';
import {  useHistory } from 'react-router-dom';
import AddCircle from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import { useContext } from 'react';
import { GroupContext, UserContext, userToGroupContext } from '../../App';
import ReactDOMServer from 'react-dom/server'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

const AddVolunteer = () => {

    const [volunteers, setVolunteers] = useState(Array.from({length: 10}, 
        (_, i) => <Form.Control key={i} type="email" placeholder="Enter email" />));
    const formRef = useRef();
    const { group } = useContext(GroupContext);
    const { user } = useContext(UserContext);
    const [showToast, setShowToast] = useState(false);
    const [showToastRejected, setShowToastRejected] = useState(false);
    const [addedUsers, setAddedUsers] = useState([]);
    const [rejectedUser, setRejectedUsers] = useState([]);
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
        axios.post(serverURL + "AddUsers", {
            emails: volunteers,
            group: group,
            manager: user,
            subject: `${user.name} join you to ${group.name} group`,
            html: ReactDOMServer.renderToString(<div>
                <h3>{`congratulations about join to ${group.name} group`}</h3>
                <p>{`${user.name}(${user.email}) join you and he is manager`}</p>
                <p>if you exist in everyOneToOne please <a target='_blank' href='http://localhost:3000/signin'>sign in to this group </a>
                    <br />else <a target="_blank" href={`http://localhost:3000/signup`}>register</a> to everyOneToOne</p>

            </div>)
        }).then(result => {
            if (result.data && result.data.length) {
                setAddedUsers(result.data);
                setShowToast(true);
                if (result.data.length !== volunteers.length) {
                    setRejectedUsers(volunteers.filter(e => !result.data.includes(e)));
                    setShowToastRejected(true);
                }
            }
            else if (volunteers.length) {
                setRejectedUsers(volunteers);
                setShowToastRejected(true);
            }
        }).catch(error => errorHandler(error))
        formRef.current.reset();
    }
    return (<div className="auth-wrapper">
        <div className="auth-inner">
            <CloseButton onClick={() => history.push("/home")} />
            <div>
                <ToastContainer style={{ position: 'relative' }} className="p-3" position="top-end">
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={9000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <strong>You have successfully added the following users:</strong><br />
                            {addedUsers.map((item, step) =>
                                <><span key={step} >{item} </span><br /></>

                            )}
                        </Toast.Body>
                    </Toast>
                    <Toast bg="danger" onClose={() => setShowToastRejected(false)} show={showToastRejected} delay={9000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Rejected</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <strong>Occcours error in send email to this users</strong><br />
                            {rejectedUser.map((item, step) =>
                                <><span key={step} >{item} </span><br /></>
                            )}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
                <h3 >Add Volunteers
                    </h3></div>
            <Form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                    {volunteers.map((element) => element)}
                </div>
                <div className="d-grid gap-2">
                    <Button type="submit"  >Add all and send email</Button>
                    </div>
            </Form>
        </div>
    </div>
    );
}
export default AddVolunteer;
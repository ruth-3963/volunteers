import { Link, useHistory, useLocation } from 'react-router-dom';
import './login.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import serverURL from '../serverURL';
import Modal from "react-bootstrap/Modal";
import { useLocationState } from 'react-router-use-location-state';
const SignIn = (props) => {
    const history = useHistory();
    const location = useLocation();
    const [listOfGroups, setListOfGroups] = useState(null);
    const [group, setGroup] = useState();
    const [events, setEvents] = useState([]);
    const [show, setShow] = useState(false);
    const list = useRef();
    const handleShow = () => { setShow(true) }
    const handleClose = () => { setShow(false) }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
            password: '',
            group: '',
            emailValid: ''
        },
        onSubmit: async (values) => {
            const email = values.email
            if (email === "") {
                formik.values.emailValid = "please type email";
            }
            else {
                formik.values.emailValid = "";
                const password = values.password;
                const result = await axios.get("" + serverURL + "api/User", {
                    params: {
                        email: email,
                        password: password
                    }
                });
                if (result.data) {
                    let user = result.data;
                    if (user.email && user.password) {
                        localStorage.setItem("user", JSON.stringify(user));
                        const groups = await axios.get("" + serverURL + "GetByManager", {
                            params: {
                                id: result.data.id,
                            }
                        });
                        setListOfGroups(groups.data);
                        props.setIsLogin(true);
                    }
                    if (user.email && !user.password) {
                        user.password = password;
                        history.push({ pathname: "/signup", state: user });
                    }
                }
                else alert("your email or password is incorrect");
            }
        },
    });
    useEffect(async () => {
        if (location && location.state && location.state.from && location.state.from.pathname === "/signup") {
            const groups = await axios.get("" + serverURL + "GetByManager", {
                params: {
                    id: location.state.user.id,
                }
            });
            setListOfGroups(groups.data);
            props.setIsLogin(true);
        }

    }, []);

    const submitAllValue = async () => {
        const localUser = JSON.parse(localStorage.getItem("user"));
        const formikGroup = formik.values.group;
        if (formikGroup === "create new group" || !listOfGroups.length) {
            history.push({ pathname: "/createGroup", state: { email: formik.values.email } });
        }
        else {
            const index = formikGroup ? listOfGroups.findIndex(g => g.name === formikGroup) : 0;
            const group = listOfGroups[index];
            let result = await axios.get("" + serverURL + "api/Group", {
                params: {
                    id: group.id,
                }
            });
            setGroup(result.data);
            localStorage.setItem("group", JSON.stringify(result.data));
            result = await axios.get("" + serverURL + "api/UsersToGroups", {
                params: {
                    groupId: group.id,
                    userId: localUser.id
                }
            });
            localStorage.setItem("userToGroup", JSON.stringify(result.data));
            history.push({ pathname: "editSchedule/" + group.id });
            if (result.data.events) {
                setEvents(JSON.parse(result.data.events));
                history.push({ pathname: "/schedule", state: { group: result.data, events: JSON.parse(result.data.events) } });
            }
            else {
                handleShow();
            }
        };
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={formik.handleSubmit} >
                    <button type="button" className="close" aria-label="Close" onClick={() => history.push("/")} >
                        <span aria-hidden="true" >&times;</span>
                    </button><br />
                    <h3>Sign In</h3>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" name="email" className="form-control"
                            onChange={formik.handleChange} value={formik.values.email} disabled={props.isLogin} />
                        <span id="emailValid" className="validMassage">{formik.values.emailValid}</span>
                    </div>
                    <div className="form-group">
                        <label>Password</label><Button variant="link" > (forget password)</Button>
                        <input type="password" id="password" name="password" className="form-control"
                            onChange={formik.handleChange} value={formik.values.password} disabled={props.isLogin} />
                    </div>
                    {!props.isLogin ? <><br /><div className="form-group">
                        <Button type="submit" variant="outline-primary" block>Continue...</Button>
                    </div></> : ""
                    }
                    {props.isLogin ?
                        <><Form.Group >
                            <Form.Label>select group</Form.Label>
                            <Form.Control as="select" id="group" name="group" value={formik.values.group} onChange={formik.handleChange}>
                                {listOfGroups.map((item, step) =>
                                    <option key={step} title={"manager : " + item.mName + "(" + item.mEmail + ")"}>
                                        {item.name} </option>
                                )}
                                <option key={listOfGroups ? listOfGroups.length : 0}>create new group</option>
                            </Form.Control>
                        </Form.Group><br /> <Button variant="primary" block onClick={() => submitAllValue()}>Submit</Button></> : ""}                </form>

            </div><br />
            <div className="auth-inner">
                <h6>You are new volunteer - <Link to="/signup"> Create Account</Link></h6>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose what do yo want to do with your group</Modal.Title>
                </Modal.Header>
                <Modal.Body>you till dont declare the schedule to your group</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => history.push({ pathname: "/editSchedule", state: { group: group } })}>
                        Edit Schedule
                    </Button>
                    <Button variant="primary" onClick={() => { history.push({ pathname: "/addVolunteer", state: { group: group } }) }}>
                        Add volunteers
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default SignIn;
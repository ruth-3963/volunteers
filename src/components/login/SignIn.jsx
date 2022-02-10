import { Link, useHistory, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton'
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import { useErrorHandler } from 'react-error-boundary';
import axios from 'axios';
import React, { useContext, useCallback, useEffect, useRef, useState } from 'react';
import { serverURL } from '../../config/config';
import Modal from "react-bootstrap/Modal";
import { GroupContext, UserContext, userToGroupContext } from '../../App';
import './login.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
const SignIn = (props) => {
    const email = new URLSearchParams(props.location.search).get("email")?.replace("/", "");;
    const history = useHistory();
    const location = useLocation();
    const handleError = useErrorHandler();
    const { user, setUser } = useContext(UserContext);
    const { group, setGroup } = useContext(GroupContext);
    const { userToGroup, setUserToGroup } = useContext(userToGroupContext);
    const [listOfGroups, setListOfGroups] = useState([]);
    const [show, setShow] = useState(false);
    const handleShow = () => { setShow(true) }
    const handleClose = () => { setShow(false) }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: email ? email : (user && user.email ? user.email : ''),
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
                try {
                    formik.values.emailValid = "";
                    const password = values.password;
                    const result = await axios.get(serverURL + "api/User", {
                        params: {
                            email: email,
                            password: password
                        }
                    });
                    if (result.data) {
                        getListOfGroups(result.data);
                    }
                    else alert("your email or password is incorrect");
                }
                catch (e) {
                    handleError(e)
                }
            }
        },
    });
    useEffect(async () => {
        if (user && user.id) {
            try {
                const groups = await axios.get(serverURL + "GetByManager", {
                    params: {
                        id: user.id,
                    }
                });
                setListOfGroups(groups.data);
                props.setIsLogin(true);
            }
            catch (err) {
                handleError(err);
            }
        }

    }, []);
    const getListOfGroups = async (currUser) => {
        if (currUser.email && currUser.password) {
            localStorage.setItem("user", JSON.stringify(currUser));
            setUser(currUser);
            const groups = await axios.get(serverURL + "GetByManager", {
                params: {
                    id: currUser.id
                }
            });
            setListOfGroups(groups.data);
            props.setIsLogin(true);
        }
        if (currUser.email && !currUser.password) {
            currUser.password = formik.values.password;
            history.push({ pathname: `/signup/?email=${currUser.email}/`});

        }
    }
    const submitAllValue = async () => {
        const formikGroup = formik.values.group;
        if (formikGroup === "create new group" || !listOfGroups.length) {
            history.push("/createGroup");
        }
        else {
            const index = formikGroup ? listOfGroups.findIndex(g => g.name === formikGroup) : 0;
            let currGroup = listOfGroups[index];
            try {
                const resultGroup = await axios.get(serverURL + "api/Group", {
                    params: {
                        id: currGroup.id,
                    }
                });
                currGroup = resultGroup.data;
                setGroup(resultGroup.data);
                localStorage.setItem("group", JSON.stringify(resultGroup.data));
                const resultUsersToGroups = await axios.get(serverURL + "api/UsersToGroups", {
                    params: {
                        groupId: currGroup.id,
                        userId: user.id
                    }
                });
                setUserToGroup(resultUsersToGroups.data)
                localStorage.setItem("userToGroup", JSON.stringify(resultUsersToGroups.data));
                if(!resultUsersToGroups.data.color){
                    history.push("/userToGroupSettings");
                    return;
                }
                    
                if (!resultGroup.data.events || !resultGroup.data.events.length) {
                    if (resultUsersToGroups.data.is_manager) {
                        handleShow();
                    }
                    else {
                        alert("the manager of this group nt yet declare events");
                        history.push("/home");
                    }
                }
                else {
                        history.push("/schedule/" + currGroup.id);
                }

            } catch (err) {
                handleError(err);
            }
        };
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={formik.handleSubmit} >
                    <CloseButton onClick={() => history.push("/home")} />
                    <h3>Sign In</h3>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" name="email" className="form-control"
                            onChange={formik.handleChange} value={formik.values.email} disabled={props.isLogin} />
                        <span id="emailValid" className="validMassage">{formik.values.emailValid}</span>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <Link to="/forgetPassword"  > (forget password)</Link>
                        <input type="password" id="password" name="password" className="form-control"
                            onChange={formik.handleChange} value={formik.values.password} disabled={props.isLogin} />
                    </div>
                    {!props.isLogin ? <><br /><div className="form-group">
                        <div className="d-grid gap-2">
                            <Button type="submit" variant="outline-primary">Continue...</Button>
                        </div>
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
                        </Form.Group><br />
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={() => submitAllValue()}>Submit</Button>
                            </div></> : ""}
                </form>

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
                    <Button variant="secondary" onClick={() => history.push(`/editSchedule/${group.id}`)}>
                        Edit Schedule
                    </Button>
                    <Button variant="primary" onClick={() => { history.push(`/addVolunteers/${group.id}`) }}>
                        Add volunteers
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default SignIn;
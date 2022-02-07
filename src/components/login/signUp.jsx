import React, { useState, useEffect } from "react";
import './login.css';
import { useFormik } from 'formik';
import { useHistory } from "react-router";
import axios from 'axios';
import {serverURL} from '../../config/config';
import Modal from "react-bootstrap/Modal";
import { Button, CloseButton } from 'react-bootstrap';
import { useContext } from "react";
import { GroupContext, UserContext } from "../../App";
import { useErrorHandler } from "react-error-boundary";
import { useParams } from "react-router-dom";

const SignUp = ({ location }) => {
    const email = new URLSearchParams(location.search).get("email")?.replace("/", "");
    const history = useHistory();
    const [matchPassword, setMatchPassword] = useState(false);
    const [show, setShow] = useState(false);
    const [listOfGroups, setListOfGroups] = useState(null);
    const { group, setGroup } = useContext(GroupContext);
    const { user, setUser } = useContext(UserContext)
    const [events, setEvents] = useState([]);
    const handleError = useErrorHandler();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: email ? email : '',
            password: '',
            phone: '',
            confirm_password: '',
            group: ''
        },
        onSubmit: async (values) => {
            if (matchPassword) {
                const user = {};
                user.name = values.name;
                user.email = values.email;
                user.password = values.password;
                user.phone = values.phone;
                try {
                    const result = await axios.post(serverURL + "api/User", {
                        name: user.name,
                        password: user.password,
                        phone: user.phone,
                        email: user.email
                    });
                    setUser(result.data);
                    localStorage.setItem("user", JSON.stringify(result.data));
                    const groups = await axios.get(serverURL + "GetByManager", {
                        params: {
                            id: result.data.id,
                        }
                    });
                    setListOfGroups(groups.data);
                    setShow(true);
                }
                catch (err) {
                    handleError(err);
                }
            }
            else {
                alert("the passwords doesnt match");
            }
        },

    });
    const changePassword = () => {
        const password = formik.values.password;
        const confirm_password = formik.values.confirm_password;
        if (password && confirm_password && password === confirm_password)
            setMatchPassword(true);
        else setMatchPassword(false);
    }

    useEffect(changePassword, [formik.values.password, formik.values.confirm_password])
    const submitAllValue = async () => {
        const formikGroup = formik.values.group;
        if (formikGroup === "create new group" || !listOfGroups.length) {
            history.push({ pathname: "/createGroup" });
        }
        else {
            const index = formikGroup ? listOfGroups.findIndex(g => g.name === formikGroup) : 0;
            const newGroup = listOfGroups[index];
            try {
                const result = await axios.get(serverURL + "api/Group", {
                    params: {
                        id: newGroup.id,
                    }
                });
                setGroup(result.data);
                localStorage.setItem("group", JSON.stringify(result.data));
                if (result.data.events) {
                    setEvents(result.data.events);
                    history.push({ pathname: `/schedule${group.id}` });
                }
                else {
                    setShow(true);
                }
            }
            catch (err) {
                handleError(err);
            }
        };
    }
    return (

        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={formik.handleSubmit} >
                    <CloseButton onClick={() => history.push("/home")} />
                    <h3>Sign Up</h3>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" id="name" name="name" className="form-control"
                            onChange={formik.handleChange} value={formik.values.name} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" name="email" className="form-control"
                            onChange={formik.handleChange} value={formik.values.email} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" id="password" name="password" className="form-control"
                            onChange={formik.handleChange} value={formik.values.password} />
                    </div>

                    <div className="form-group">
                        <label>confirm password</label>
                        <input type="password" id="confirm_password" name="confirm_password"
                            onChange={formik.handleChange} value={formik.values.confirm_password}
                            className={matchPassword ? "form-control" : "form-control confirm_password_incorrect"} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" id="phone" name="phone" className="form-control"
                            onChange={formik.handleChange} value={formik.values.phone} />
                    </div>
                    <br />

                    <button type="submit" className="btn btn-primary btn-block">Create</button>

                </form>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>select group</Modal.Title>
                </Modal.Header>
                <Modal.Body>select group or create new group</Modal.Body>
                <Modal.Footer>
                    <select className="browser-default custom-select"
                        id="group" name="group" value={formik.values.group} onChange={formik.handleChange}>
                        {listOfGroups ? listOfGroups.map((item, step) =>
                            <option key={step} title={"manager : " + item.mName + "(" + item.mEmail + ")"}>
                                {item.name} </option>
                        ) : ""}
                        <option key={listOfGroups ? listOfGroups.length : 0}>create new group</option>
                    </select>
                    <div className="d-grid gap-2">
                    <Button variant="primary"  onClick={() => submitAllValue()}>Submit</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default SignUp;
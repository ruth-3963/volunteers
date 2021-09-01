import React, { useState, useEffect } from "react";
import './login.css';
import { useFormik } from 'formik';
import { useHistory } from "react-router";
import axios from 'axios';
import serverURL from '../serverURL';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';


const SignUp = () => {
    const history = useHistory();
    const [matchPassword, setMatchPassword] = useState(false);
    const [show, setShow] = useState(false);
    const [listOfGroups, setListOfGroups] = useState(null);
    const [group, setGroup] = useState();
    const [events, setEvents] = useState([]);

    const formik = useFormik({
        initialValues: {
            name: '',
            mail: '',
            password: '',
            phone: '',
            confirm_password: '',
            group: ''
        },
        onSubmit: async (values) => {
            if (matchPassword) {
                const user = {};
                user.name = values.name;
                user.email = values.mail;
                user.password = values.password;
                user.phone = values.phone;
                const result = await axios.post("" + serverURL + "api/User", {
                    name: user.name,
                    password: user.password,
                    phone: user.phone,
                    email: user.email
                });
                debugger;
                const groups = await axios.get("" + serverURL + "GetByManager", {
                    params: {
                        id: result.data.id,
                    }
                });
                setListOfGroups(groups.data);
                setShow(true);
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
        debugger;
        const formikGroup = formik.values.group;
        if (formikGroup === "create new group" || !listOfGroups.length) {
            history.push({ pathname: "/createGroup", state: { email: formik.values.email } });
        }
        else {
            const index = formikGroup ? listOfGroups.findIndex(g => g.name === formikGroup) : 0;
            const group = listOfGroups[index];
            const result = await axios.get("" + serverURL + "api/Group", {
                params: {
                    id: group.id,
                }
            });
            setGroup(result.data);
            if (result.data.events) {
                setEvents(JSON.parse(result.data.events));
                history.push({ pathname: "/schedule", state: { group: result.data, events: JSON.parse(result.data.events) } });
            }
            else {
                setShow(true);
            }
            //history.push({pathname:"/group",state:{group:listOfGroups[index]}});
        };
    }
    return (

        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={formik.handleSubmit} >
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" id="name" name="name" className="form-control"
                            onChange={formik.handleChange} value={formik.values.name} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="mail" name="mail" className="form-control"
                            onChange={formik.handleChange} value={formik.values.mail} />
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

                
                    <Button variant="primary" block onClick={() => submitAllValue()}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default SignUp;
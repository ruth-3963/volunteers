
import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import serverUrl from '../../serverURL';
import './profile.css'
import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion'
import { Link } from "react-router-dom";
import ChooseColor from '../../group/chooseColor';
import { useContext } from 'react';
import { UserContext, userToGroupContext } from '../../App';
import { Modal, FormControl, Alert } from 'react-bootstrap';
import { BorderColor } from '@material-ui/icons';
import { useErrorHandler } from 'react-error-boundary';
import serverURL from '../../serverURL';
export const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const { userToGroup } = useContext(userToGroupContext)
    const [currGroup, setCurrGroup] = useState({});
    const [userGroups, setUserGroup] = useState([]);
    const [showColorAlert, setShowColorAlert] = useState(false);
    const [changeGroup, setChangeGroup] = useState(true);
    const [isInEdit, setIsInEdit] = useState(false);
    const [showValid, setShowValid] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [variantAlert, setVariantAlert] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [password, setPassword] = useState("");
    const [validError, setValidError] = useState(false);
    const [color, setColor] = useState('');
    const errorHandler = useErrorHandler();

    useEffect(() => {
        formik.values.email = user.email;
        formik.values.phone = user.phone;
        formik.values.name = user.name;
        formik.values.password = user.password;
        formik.values.confirmPassword = user.password;

    }, []);
    useEffect(async () => {
        try {
            const groups = await axios.get(serverUrl + "GetByManager", {
                params: {
                    id: user.id,
                }
            });
            console.log(changeGroup);
            setUserGroup(groups.data);
            console.log(changeGroup);
        }
        catch (err) {
            errorHandler(err)
        }
    }, [changeGroup]);
    const handleClose = () => {
        setShowValid(false);
        setValidError(false);
        setPassword("");
    };
    const cancel = () => {
        setIsInEdit(false);
        for (const [key, value] of Object.entries(formik.values)) {
            if (user.hasOwnProperty(key)) {
                formik.values[key] = user[key];
            }
        }
    }
    const checkPassword = () => {
        if (user.password === password) {
            setIsInEdit(true);
            handleClose();
            setPassword("");
        }
        else {
            setValidError(true)
        }
    }
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
        },
        onSubmit: async (values) => {
            axios.put(`${serverURL}api/User/${user.id}`, {
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone
            }).then(result => {
                if (result.data) {
                    localStorage.setItem("user", JSON.stringify(result.data));
                    setUser(result.data)
                    setAlertMessage("User updated");
                    setVariantAlert('success')
                    setIsInEdit(false);
                }
                else {
                    setAlertMessage("Occurred error - user not updated");
                    setVariantAlert('danger')
                }
                setShowAlert(true);
            }).catch(err => errorHandler(err))
        }
    });

    const changeColor = (group) => {
        setCurrGroup(group);
        setColor(group.color)
        setShowColorAlert(true)
    }
    const deleteGroup = (group) => {
        if (userToGroup.is_manager) {
            alert('you are the manager , yoy cant left the group')
        }
        else {
            axios.post(serverURL + "removeUserFromGroup", group);
        }
    }
    const updateGroup = (e) => {
        e.preventDefault();
        setShowValid(true);
    }
    return (
        <>
            {showAlert &&
                <Alert variant={variantAlert} onClose={() => setShowAlert(false)} dismissible>
                    <b>{alertMessage}</b>
                </Alert>}
            <Modal show={showValid} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Validation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>We want sure that it is really you.<br />Please type password</b><br /><br />
                    <FormControl
                        type="password"
                        placeholder="type password..."
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    ></FormControl>
                    {validError && <b style={{ color: "red" }}>password doesnt match</b>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={checkPassword}>
                        Check
                    </Button>
                </Modal.Footer>
            </Modal>
            {showColorAlert && <ChooseColor
                showColorAlert={showColorAlert}
                color={color} setColor={(val) => { setColor(val) }}
                setShow={(val) => setShowColorAlert(val)}
                group={currGroup}
                changeGroup={changeGroup}
                setChangeGroup={(val) => setChangeGroup(val)}
            />}

            <div className="container rounded bg-white mt-5 mb-5" >
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <span className="font-weight-bold">{formik.values.name}</span><span className="text-black-50">{formik.values.email}</span><span> </span></div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right"><u>Profile Settings</u></h4>
                                <Button variant='link' onClick={updateGroup} >update details<Edit></Edit></Button>
                            </div>
                            <div className="row mt-2">
                            </div> <form onSubmit={formik.handleSubmit}>
                                <div className="row mt-3">
                                    <div className="col-md-12"><label className="labels">Name</label>
                                        <input type="text" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.name} name="name" id="name" /></div>
                                    <div className="col-md-12"><label className="labels">Email</label>
                                        <input type="email" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.email} name="email" id="ëmail" /></div>
                                    <div className="col-md-12"><label className="labels">Phone</label>
                                        <input type="text" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.phone} name="phone" id="phone" /></div>
                                    <div className="col-md-12"><label className="labels">Password</label>
                                        <input type="password" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.password} name="password" id="password" /></div>
                                    <div hidden={!isInEdit} className="col-md-12"><label className="labels">Confirm password</label>
                                        <input type="password" className="form-control" onChange={formik.handleChange} value={formik.values.confirmPassword} name="confirmPassword" id="confirmPassword"
                                            style={formik.values.confirmPassword === formik.values.password ? { borderColor: "green" } : { borderColor: "red" }} /></div>
                                </div>

                                <div className="mt-3 text-center" id="buttons">
                                    <Button block hidden={!isInEdit} disabled={formik.values.confirmPassword != formik.values.password}
                                        type="submit" className="btn btn-primary profile-button" >Save Profile</Button>
                                    <Button block hidden={!isInEdit} onClick={cancel} className="btn btn-primary profile-button" >Cancel</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center experience">
                                <span>Groups</span>
                                <Button variant='outline-primary'>create group</Button>
                            </div><br />

                            <Accordion defaultActiveKey="0">
                                {userGroups.map((item, step) => <Accordion.Item eventKey={item.id}>
                                    <Accordion.Header>{item.name}</Accordion.Header>
                                    <Accordion.Body>
                                        <p>
                                            {item.mName ? <><span><strong>Manager : </strong>{item.mName}</span> <br /></> : ""}
                                            <strong>Manager email : </strong>{item.mEmail}
                                            {item.color ? <><br /><strong>color : </strong><span style={{ backgroundColor: item.color }}>{item.color}</span> </> : ""}
                                        </p>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Button variant="outline-primary" onClick={() => changeColor(item)}>change color</Button>
                                            <Button variant="outline-primary" onClick={() => deleteGroup(item)}>delete group</Button>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                                )}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div >
        </>

    )
}

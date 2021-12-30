
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
import ChooseColor from '../chooseColor';
import { useContext } from 'react';
import { UserContext } from '../../App';
export const Profile = () => {
    const {user , setUser } = useContext(UserContext);
    const [currGroup, setCurrGroup] = useState({});

    const [userGroups, setUserGroup] = useState([]);
    const [showColorAlert, setShowColorAlert] = useState(false);
    const [changeGroup, setChangeGroup] = useState(true);
    const [isInEdit, setIsInEdit] = useState(false);
    const [color, setColor] = useState(''); const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: ''
        },
        onSubmit: async (values) => {
            debugger;
            // if (matchPassword) {
            //     const user = {};
            //     user.name = values.name;
            //     user.email = values.email;
            //     user.password = values.password;
            //     user.phone = values.phone;
            //     const result = await axios.post("" + serverURL + "api/User", {
            //         name: user.name,
            //         password: user.password,
            //         phone: user.phone,
            //         email: user.email
            //     });
            //     localStorage.setItem("user", JSON.stringify(result.data));
            //     const groups = await axios.get("" + serverURL + "GetByManager", {
            //         params: {
            //             id: result.data.id,
            //         }
            //     });
            //     setListOfGroups(groups.data);
            //     setShow(true);
            // }
            // else {
            //     alert("the passwords doesnt match");
            // }
        },
    });
    useEffect(() => {
        formik.values.email = user.email;
        formik.values.phone = user.phone;
        formik.values.address = user.address;
        formik.values.password = user.password;

    }, []);
    useEffect(async () => {
        const groups = await axios.get("" + serverUrl + "GetByManager", {
            params: {
                id: user.id,
            }
        });
        console.log(changeGroup);
        setUserGroup(groups.data);
        console.log(changeGroup);
    }, [changeGroup]);
    const changeColor = (group) => {

        setCurrGroup(group);
        setColor(group.color)
        setShowColorAlert(true)
    }
    const deleteGroup = (group) => {
        debugger;
    }
    return (
        <> <ChooseColor
            showColorAlert={showColorAlert}
            color={color} setColor={(val) => { setColor(val) }}
            setShow={(val) => setShowColorAlert(val)}
            group={currGroup}
            changeGroup={changeGroup}
            setChangeGroup={(val) => setChangeGroup(val)}
        />

            <div className="container rounded bg-white mt-5 mb-5" >
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            {/* <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /> */}
                            <span className="font-weight-bold">{formik.values.name}</span><span className="text-black-50">{formik.values.email}</span><span> </span></div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right"><u>Profile Settings</u></h4>
                                <Button variant='link' onClick={(e) => { e.preventDefault(); setIsInEdit(true) }} >update details<Edit></Edit></Button>
                            </div>
                            <div className="row mt-2">
                                {/* <div className="col-md-6"><label className="labels">Name</label><input type="text" className="form-control" placeholder="first name" value=""/></div> */}
                            </div> <form onSubmit={formik.handleSubmit}>
                            <div className="row mt-3">
                               
                                    <div className="col-md-12"><label className="labels">Email</label>
                                        <input type="email" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.email} name="email" id="ëmail" /></div>
                                    <div className="col-md-12"><label className="labels">Phone</label>
                                        <input type="text" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.phone} name="phone" id="phone" /></div>
                                    <div className="col-md-12"><label className="labels">Address</label>
                                        <input type="text" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.address} name="address" id="address" /></div>
                                    <div className="col-md-12"><label className="labels">Password</label>
                                        <input type="password" disabled={!isInEdit} className="form-control" onChange={formik.handleChange} value={formik.values.password} name="password" id="password" /></div>
                                </div>

                            <div className="mt-3 text-center" id="buttons">
                                <Button block hidden={!isInEdit} type="submit" className="btn btn-primary profile-button" >Save Profile</Button>
                                <Button block hidden={!isInEdit} onClick={() => setIsInEdit(false)} className="btn btn-primary profile-button" >Cancel</Button>
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
                            {/* <div className="col-md-12"><label className="labels">Experience in Designing</label>
                            <input type="text" className="form-control" placeholder="experience" value="" />
                        </div> <br /> */}

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
                <div>
                </div>
            </div ></>

    )
}
 
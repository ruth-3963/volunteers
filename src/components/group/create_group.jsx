import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Button, CloseButton } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useErrorHandler } from 'react-error-boundary';
import { useHistory, useLocation } from 'react-router-dom';
import { GroupContext, UserContext, userToGroupContext } from '../../App';
import { serverURL } from '../../config/config';
import UserToGroupSettings from './userToGroupSettings';
const CreateGroup = () => {
    const location = useLocation();
    const [isCreate, setIsCreate] = useState(false);
    const [showSettingsAlert,setShowSettingsAlert] = useState(false);
    const [settings,setSettings] = useState();
    const { group, setGroup } = useContext(GroupContext);
    const { userToGroup, setUserToGroup } = useContext(userToGroupContext)
    const { user, setUser } = useContext(UserContext);
    const errorHandler = useErrorHandler();
    const history = useHistory();
    useEffect(() => {
        if (!user && !user.id)
            history.push("/home");
    }, []);
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        onSubmit: async (values) => {
            axios.post(serverURL + "api/Group", {
                id_manager: user.id,
                name: values.name,
                description: values.description
            }).then(result => {
                if (result.data) {
                    setIsCreate(true);
                    setGroup(result.data.group);
                    localStorage.setItem("group", JSON.stringify(result.data.group));
                    setUserToGroup(result.data);
                    localStorage.setItem("userToGroup", JSON.stringify(result.data));
                    setSettings({color:result.data.color,reminder:result.data.reminder});
                    setShowSettingsAlert(true);
                }
                else {
                    alert("we dont succed to create group maybe yo have another group with the same name?");
                }
            }).catch(err => errorHandler(err));
        }
    });
    return (user && user.id && <>
        {showSettingsAlert && <UserToGroupSettings
            setShow={(val) => setShowSettingsAlert(val)}
            settings={settings}
            setSettings={setSettings}
        />}
        <div className="auth-wrapper">
            <div className="auth-inner">
                <CloseButton onClick={() => history.push("/home")} />
                <h3>Create group</h3>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Form.Label>Group name</Form.Label>
                        <Form.Control type="text" placeholder="enter group name" id="name" name="name"
                            onChange={formik.handleChange} value={formik.values.name} disabled={isCreate} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description on your group</Form.Label>
                        <Form.Control as="textarea" rows={3} id="description" name="description"
                            onChange={formik.handleChange} value={formik.values.description} disabled={isCreate} />
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button type="submit" variant="primary" hidden={isCreate}>Submit</Button>
                    </div>
                </Form>
                <div className="d-grid gap-2">
                    <Button variant="outline-primary" hidden={!isCreate}
                        onClick={() => history.push(`/addVolunteers/${group.id}`)}>
                        add volunteers to your group</Button>
                    <Button variant="outline-primary" hidden={!isCreate} onClick={() => history.push(`/editSchedule/${group.id}`)}>
                        edit schedule to your group</Button>
                </div>
            </div></div></>
    )
}

export default CreateGroup;


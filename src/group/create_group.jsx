import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory, useLocation } from 'react-router-dom';
import serverURL from '../serverURL';
const CreateGroup = () => {
    const location = useLocation();
    const [isCreate, setIsCreate] = useState(false);
    const [group ,setGroup] = useState(null);
    const [localUser , setLocalUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [localGroup , setLocalGroup] = useState(JSON.parse(localStorage.getItem("group")))
    const history = useHistory();
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        onSubmit:async(values) => {
            const result = await axios.post("" + serverURL + "api/Group", {
                id_manager: localUser.id,
                name: values.name,
                description: values.description
            })
            if (result.data) {
                setIsCreate(true);
                setGroup(result.data);
                setLocalGroup(result.data);
                localStorage.setItem("group", JSON.stringify(result.data));
            }
            else {
                alert("we dont succed to create group maybe yo have another group with the same name?");
            }

        },
    });
    return (<div className="auth-wrapper">
        <div className="auth-inner">
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
            <Button type="submit" variant="primary" block hidden={isCreate}>Submit</Button>
        </Form>
        <Button variant="outline-primary" block hidden={!isCreate}
         onClick={()=>history.push({pathname:"/addVolunteer",state:{group:group}})}>
            add volunteers to your group</Button>
        <Button variant="outline-primary" block hidden={!isCreate} onClick={()=>history.push({pathname:"/editSchedule/" + localGroup.id + "",state:{group:group}})}>
            edit schedule to your group</Button>
    </div></div >
    )
}

export default CreateGroup;


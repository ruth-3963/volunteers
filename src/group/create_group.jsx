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
    const history = useHistory();
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        onSubmit:async(values) => {
            const result = await axios.post("" + serverURL + "api/Group", {
                email: location.state.email,
                name: values.name,
                description: values.description
            })
            if (result.data) {
                setIsCreate(true);
                setGroup(result.data);
            }
            else {
                alert("we dont succed to create group maybe yo have another group with the same name?");
            }

        },
    });
    //hear i need have the mail of manager
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
        <Button variant="outline-primary" block hidden={!isCreate} onClick={()=>history.push({pathname:"/editSchedule",state:{group:group}})}>
            edit schedule to your group</Button>
    </div></div >
    )
}

export default CreateGroup;


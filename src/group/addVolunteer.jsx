import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import serverURL from '../serverURL';
import { useLocation, useHistory } from 'react-router-dom';

const container = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
}
const AddVolunteer = () => {

    const [volunteers, setVolunteers] = useState([]);
    const location = useLocation();
    const history = useHistory();
    const formRef = useRef();
    const [group, setGroup] = useState();
    useEffect(() => {
        if (location.state && location.state.group)
            setGroup(location.state.group)
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        const arr = Array.prototype.slice.call(e.target.children[0].children);
        const volunteers = [];
        arr.map((chaild, index) => {
            if (chaild.value) {
                const email = chaild.value;
                volunteers.push({ email: email });
            }
        });
        axios.post("" + serverURL + "AddUsers", {
            list: volunteers,
            group: group
        })
        formRef.current.reset();
    }
    return (<div className="auth-wrapper">
        <div className="auth-inner">
            <h3>Add Volunteers</h3><br />
            <Form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                    {[...Array(8)].map((e, i) => <Form.Control type="email" placeholder="Enter email" />)}
                </div>
                <Button type="submit" block >Add all and send email</Button>
            </Form>
        </div>
    </div>
    );
}
export default AddVolunteer;
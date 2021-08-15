import axios from 'axios';
import React, { useState, useRef } from 'react';
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
    const [group, setGroup] = useState(location.state.group);
    const setStateOfVolunteers = (e, i) => {
        if (e.target.id === "email") {

        }
        else {

        }
    }
    const EditSchedule = () => {
        history.push({ pathname: "/schedule", state: { group: group, edit: true } });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const arr = Array.prototype.slice.call(e.target.children[0].children);
        const volunteers = [];
        arr.map((chaild, index) => {
            if (index % 2 === 0 && chaild.children[1].value.length > 0) {
                const name = chaild.children[0].value;
                const email = chaild.children[1].value;
                volunteers.push({ name: name, email: email });
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
            <form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
                <ul>
                    {(() => {
                        const inputs = [];
                        for (let i = 0; i < 5; i++) {
                            volunteers.push({ name: "", email: "" });
                            inputs.push(<><li key={i} className="container" style={container}>
                                <input type="text" placeholder="name" id="name" />
                                <input type="email" id="email" placeholder="email" />
                                <label>send email</label><input type="checkbox" id="sendEmail"/>
                            </li><br /></>);
                        }
                        return inputs;
                    })()}
                </ul>


                <Button type="submit" block>Add all</Button>
                <Button block onClick={() => EditSchedule()}>Edit schedule</Button>
                <Button block disabled={!group.events}
                    onClick={() => {history.push({ pathname: "/schedule", state: { group: group, events: JSON.parse(group.events) } })}}>schedule</Button>
            </form></div></div>
    );
}
export default AddVolunteer;
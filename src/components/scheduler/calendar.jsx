import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose, ResourcesDirective, ResourceDirective, } from '@syncfusion/ej2-react-schedule';
import { useParams } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
import { GroupContext, UserContext, userToGroupContext } from '../../App';
import { useErrorHandler } from 'react-error-boundary';
import { serverURL } from '../../config/config';
import '../../App.css';
import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";
import { Toast, ToastContainer } from 'react-bootstrap';
//import './CalendarStyles.css';



const Calendar = (props) => {
    const { id } = useParams();
    const calendar = useRef(1);
    const [events, setEvents] = useState([]);
    const [ownerData, setOwnerData] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastData, setToastData] = useState({ body: 'aaa', title: 'bbb' });
    const { user } = useContext(UserContext);
    const { group } = useContext(GroupContext);
    const { userToGroup } = useContext(userToGroupContext);
    const handleError = useErrorHandler();
    useEffect(async () => {
        if (group) {
            try {
                let result = await axios.get(serverURL + "api/Event/" + id);
                if (result.data) {
                    setEvents(result.data);
                }
                result = await axios.get(serverURL + "getOwnerData", {
                    params: {
                        groupId: id,
                    }
                });
                setOwnerData(result.data);
            }
            catch (err) {
                handleError(err)
            }
        }
    }, [group]);

    const onActionBegin = (args) => {
        if (args.changedRecords) {
            setEvents(calendar.current.eventsData);
        }
    }

    const volunteer = async (data) => {
        const isConfirm = window.confirm("are yo sure that you want to volunteer in this shift?")
        if (!isConfirm) {
            return;
        }
        try {
            delete data.Id;
            const result = await axios.post(`${serverURL}/inlay/${user.id}`, data)
            if (result.data) {
                setToastData({ title: 'success', body: `we inlay you in ${data.Subject} shift` })
            }
            else {
                setToastData({ title: 'reject', body: `we dont success to inlay you in this ${data.Subject} shift` })
            }
            let resultEvents = await axios.get(serverURL + "api/Event/" + id);
            if (resultEvents.data) {
                setEvents(resultEvents.data);
            }
            setShowToast(true)
        }
        catch (err) {
            handleError(err);
        }

    }
    const addComments = (data) => {
        const comments = prompt("enter your comments", data.Description ? data.Description : "");
        if (!comments) {
            return;
        }
        let newEvent = { ...data }
        newEvent.Description = comments;
        const index = calendar.current.eventsData.findIndex(val => val.id === data.id)
        calendar.current.eventsData[index] = newEvent;
        setEvents(calendar.current.eventsData);
        axios.put(`${serverURL}/api/Event/?eventId=${newEvent.id}&description=${newEvent.Description}`);
    }
    const cancelVolunteer = async (data) => {
        delete data.Id;
        const result = await axios.post(`${serverURL}/inlay/${user.id}`, data)
        if (result.data) {
            setToastData({ title: 'success', body: `we cancel your volunteer in ${data.Subject} shift` })
        }
        else {
            setToastData({ title: 'reject', body: `we dont success cancel your volunteer  in this ${data.Subject} shift` })
        }
        let resultEvents = await axios.get(serverURL + "api/Event/" + id);
        if (resultEvents.data) {
            setEvents(resultEvents.data);
        }
        setShowToast(true)
    }
    const open = (e) => {
        const createButton = (textContent, func, data) => {
            let btn = document.createElement('button');
            btn.setAttribute('class', 'btn btn-light');
            btn.textContent = textContent;
            btn.onclick = () => func(data);
            return btn;
        }
        if (e.type === "QuickInfo" && e.data.StartTime > new Date()) {
            let div = document.createElement('div');
            div.setAttribute('class', 'buttom-quick-popup')
            div.append(createButton("add comments", addComments, e.data));
            if (!e.data.OwnerId) {
                div.append(createButton("Volunteer", volunteer, e.data));
            }
            if (e.data.OwnerId === user.id) {
                div.append(createButton("Cancel Volunteer", cancelVolunteer, e.data));
            }
            const elem = document.getElementsByClassName("e-popup-content")[0];
            elem.append(div);
        }

    }
    return (
        <div>
            <link
                rel="stylesheet"
                href="./CalendarStyles.css"
            />
            <ToastContainer className="p-3" position="top-end">
                <Toast onClose={() => setShowToast(false)} show={showToast}
                delay={5000} autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">{toastData.title}</strong>
                    </Toast.Header>
                    <Toast.Body>{toastData.body}</Toast.Body>
                </Toast>
            </ToastContainer>
            <ScheduleComponent ref={calendar} width='100%' height='100%'
                eventSettings={{
                    allowAdding: false, allowDeleting: false, allowEditing: false, dataSource: events
                }}
                actionBegin={onActionBegin}
                popupOpen={open}
            >
                <ResourcesDirective>
                    <ResourceDirective field='OwnerId' title='Volunteer' name='Owners'
                        dataSource={ownerData}
                        textField="OwnerText" idField='Id' colorField='OwnerColor'>
                    </ResourceDirective>
                </ResourcesDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
        </div>);
}
export default Calendar;

import React, { useState } from "react";
import { Modal, Form, Button, InputGroup, FormControl } from "react-bootstrap";
const ChooseDate = (props) => {
    const handleClose = () => props.setShowDateAlert(false);
    const [message, setMessage] = useState("")
    const submitRangeDates = () => {
        if (props.calendar && props.calendar.eventsData)      {
            let eventsData = props.calendar.eventsData;
            eventsData = eventsData.filter(e => e.StartTime > Date.parse(fromValue) && e.EndTime < Date.parse(toValue));
            if (eventsData && eventsData.length) {
                props.setShowDateAlert(false);
                props.calc(eventsData);
                return;
            }
        }
        setMessage("no events to calc")

    }
    const getDisplayEvents = () => {
        if (props.calendar && props.calendar.eventsData) {
            let eventsData = props.calendar.getCurrentViewEvents();
            if (eventsData && eventsData.length) {
                props.setShowDateAlert(false)
                props.calc(eventsData);
                return;
            }
        }
        setMessage("no events to calc")
    }
    const [fromValue, setFromValue] = useState(0);
    const [toValue, setToValue] = useState(0);
    return (
        <Modal
            show={props.showDateAlert}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>choose range Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>From</InputGroup.Text>
                    <FormControl type="date"
                        name="duedate"
                        placeholder="Due date"
                        value={fromValue} max={toValue} onChange={(val) => setFromValue(val.target.value)}
                        aria-label="Dollar amount (with dot and two decimal places)" />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text>To</InputGroup.Text>
                    <FormControl type="date"
                        name="duedate"
                        value={toValue} min={fromValue} onChange={(val) => setToValue(val.target.value)}
                        placeholder="Due date" aria-label="Dollar amount (with dot and two decimal places)" />
                </InputGroup>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>Close </Button>
                <Button disabled={!fromValue || !toValue} onClick={() => submitRangeDates()}>Send</Button>
                <Button variant="primary" onClick={() => getDisplayEvents()}>get display events</Button>
            </Modal.Footer>
        </Modal>)
}
export default ChooseDate;
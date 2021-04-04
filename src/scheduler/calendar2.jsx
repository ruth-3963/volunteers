import React, { cloneElement, useEffect, useRef, useState } from 'react';
import './CalendarStyles.css';
import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose } from '@syncfusion/ej2-react-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useHistory, useLocation } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
const arr1 = [
    {
        start: "Sun Mar 07 2021 19:00:00 GMT+0200 (שעון ישראל (חורף))",
        end: "Sun Mar 07 2021 20:00:00 GMT+0200 (שעון ישראל (חורף))"
    }
    ,
    {
        start: "Sun Mar 07 2021 21:30:00 GMT+0200 (שעון ישראל (חורף))",
        end: "Sun Mar 07 2021 23:30:00 GMT+0200 (שעון ישראל (חורף))"
    }
    ,
    {
        start: "Wed Mar 10 2021 21:30:00 GMT+0200 (שעון ישראל (חורף))",
        end: "Wed Mar 10 2021 23:30:00 GMT+0200 (שעון ישראל (חורף))"
    }
    ,
    {
        start: "Sat Mar 13 2021 21:00:00 GMT+0200 (שעון ישראל (חורף))",
        end: "Sat Mar 13 2021 22:00:00 GMT+0200 (שעון ישראל (חורף))"
    }
    ,
    {
        start: "Thu Mar 11 2021 21:00:00 GMT+0200 (שעון ישראל (חורף))",
        end: "Thu Mar 11 2021 22:30:00 GMT+0200 (שעון ישראל (חורף))"
    }
    ,
]
const arr2 = [];
const Calendar = (props) => {
    const location = useLocation();
    const history = useHistory();
    const calendar = useRef()
    const first = useRef(false);
    const [time, setTime] = useState(0);
    const [events, setEvents] = useState(location.state.events);
    const [group, setGroup] = useState(location.state.group);
    
    const getMonthCellContent = (date) => {
        if (date.getMonth() === 10 && date.getDate() === 23) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
        }
        else if (date.getMonth() === 11 && date.getDate() === 9) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/get-together.svg" />';
        }
        else if (date.getMonth() === 11 && date.getDate() === 13) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
        }
        else if (date.getMonth() === 11 && date.getDate() === 22) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/thanksgiving-day.svg" />';
        }
        else if (date.getMonth() === 11 && date.getDate() === 24) {
            return '<img src="https://ej2.syncfusion.com/demos/src/schedule/images/christmas-eve.svg" />';
        }
        else if (date.getMonth() === 11 && date.getDate() === 25) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/christmas.svg" />';
        }
        else if (date.getMonth() === 0 && date.getDate() === 1) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg" />';
        }
        else if (date.getMonth() === 0 && date.getDate() === 14) {
            return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
        }
        return '';
    }
    const getWorkCellText = (date) => {
        let weekEnds = [0, 6];
        if (weekEnds.indexOf(date.getDay()) >= 0) {
            return "<img src='https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg' />";
        }
        return '';
    }
    const cellTemplate = (props) => {
        if (props.type === "workCells") {
            return (<div className="templatewrap" dangerouslySetInnerHTML={{ __html: this.getWorkCellText(props.date) }}></div>);
        }
        if (props.type === "monthCells") {
            return (<div className="templatewrap" dangerouslySetInnerHTML={{ __html: this.getMonthCellContent(props.date) }}></div>);
        }
        return (<div></div>);
    }
    const sortArr = () => {
        for (let index = 0; index < events.length; index++) {

            let dt = new Date(events[index].StartTime);
            let dtEnd = new Date(events[index].EndTime);
            while (dt < dtEnd) {
                arr2.push(dt);
                dt = new Date(dt);
                dt.setMinutes(dt.getMinutes() + 30);
            }
        }
        for (let i = 0; i < arr2.length; i++) {

            for (let j = i + 1; j < arr2.length; j++) {

                if (arr2[i].getHours() > arr2[j].getHours()) {
                    //if (start.getMinutes() > end.getHours()
                    [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
                }
                else if (arr2[i].getHours() === arr2[j].getHours()) {
                    if (arr2[i].getMinutes() > arr2[j].getMinutes()) {
                        [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
                    }
                    else if (arr2[i].getMinutes() === arr2[j].getMinutes()) {
                        if (arr2[i].getDay() > arr2[j].getDay()) {
                            [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
                        }
                    }
                }

            }

        }
    }
    const onRenderCell = (e) => {
        if (!first.current) { setTime(performance.now()); sortArr(); first.current = true; console.log(arr1) }
        // console.log(e.date ? e.date : "null");
        const t = performance.now();
        console.log(e.date);
        if (arr2.length && e.date) {
            if (Date.parse(e.date) === Date.parse(arr2[0])) {
                e.element.classList.add("my-cell");
                arr2.shift();
            }
            else {
                //e.onClick = handleDisabled;
            }
        }
        if (e.date && e.date.getDay() === 6 && e.date.getHours() === 23) {
            const t = performance.now() - time;
            console.log(t);
        }
    }
    const editorTemplate = (props) => {
        return (props !== undefined ? <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}><tbody>
            <tr><td className="e-textlabel">Summary</td><td colSpan={4}>
                <input id="Summary" className="e-field e-input" type="text" name="Subject" style={{ width: '100%' }} disabled={true} />
            </td></tr>
            <tr><td className="e-textlabel">Status</td><td colSpan={4}>
                <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType" className="e-field" style={{ width: '100%' }} dataSource={['New', 'Requested', 'Confirmed']} value={props.EventType || null}></DropDownListComponent>
            </td></tr>
            <tr><td className="e-textlabel">From</td><td colSpan={4}>
                <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field" disabled={true}></DateTimePickerComponent>
            </td></tr>
            <tr><td className="e-textlabel">To</td><td colSpan={4}>
                <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field"></DateTimePickerComponent>
            </td></tr>
            <tr><td className="e-textlabel">Reason</td><td colSpan={4}>
                <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }}></textarea>
            </td></tr></tbody></table> : <div></div>);
    }
    const penPopUp = (args) => {
        if (![...args.target.classList].includes("my-cell")) {
            args.cancel = true;
        }
    }
    const click = () => {
        console.log(calendar.current);
        console.log(calendar.current);
    }
    return (<>
        <div ><Button variant="link" onClick={() => history.push({ pathname: "/addVolunteer", state: { group: group } })}>Add Volunteers</Button>
            <Button variant="link" onClick={() => history.push({ pathname: "/editSchedule", state: { group: group } })}>Edit Schedule</Button></div>
        <ScheduleComponent ref={calendar} renderCell={(e) => onRenderCell(e)} width='100%' height='550px'
            editorTemplate={(e) => editorTemplate(e)} popupOpen={(args) => penPopUp(args)}>
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent><button onClick={() => click()}></button></>);
}
export default Calendar;

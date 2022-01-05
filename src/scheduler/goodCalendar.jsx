import React, { cloneElement, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import serverURL from '../serverURL';
import '../App.css';
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
import scheduleData from './datasource.js';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose, ResourcesDirective, ResourceDirective, } from '@syncfusion/ej2-react-schedule';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useHistory, useLocation, useParams } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/esm/Alert';

import Group from '../group/group';
import { useContext } from 'react';
import { GroupContext, UserContext, userToGroupContext } from '../App';

const Calendar = (props) => {
    const { id } = useParams();
    const calendar = useRef(1);
    const [events, setEvents] = useState([]);
    const [ownerData, setOwnerData] = useState([]);
    const history = useHistory();
    const location = useLocation();
    const { user, setUser } = useContext(UserContext);
    const { group, setGroup } = useContext(GroupContext);
    const { userToGroup, setuserToGroup } = useContext(userToGroupContext);

    useEffect(async () => {
        if (group) {
            let result = await axios.get("" + serverURL + "api/Event/" + group.id);
            if (result.data) {
                setEvents(result.data);
            }
            result = await axios.get("" + serverURL + "getOwnerData", {
                params: {
                    groupId: group.id,
                }
            });
            setOwnerData(result.data);
        }
    }, [group]);
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

    const footerTemplate = (e) => {
        return <Button variant='link' style={{ float: "left" }}>add commnt</Button>
    }
    const open = (e) => {
        const title = React.createElement('h1', {}, 'My First React Code');
        debugger;
        // 
        // React.createElement()
    }
    return (
    <div>
        
        {userToGroup && userToGroup.is_manager ?
            <ButtonComponent onClick={(e) => { history.push(`./../editSchedule/${userToGroup.group_id}`) }}>edit schedule</ButtonComponent> : ""}
        {userToGroup && <ButtonComponent  onClick={(e) => { history.push(`./../chooseEvents/${userToGroup.group_id}`)}}>Choose events</ButtonComponent>}
 
        <ScheduleComponent ref={calendar} width='100%' height='100%'
            //  quickInfoTemplates={(props) => {
            //     return (<div className="quick-info-header">
            //         <div className="quick-info-header-content" >
            //             <div className="quick-info-title"></div>
            //         </div>
            //     </div>)

            // }}
            //  quickInfoTemplates={{
            //         footer: (e) => footerTemplate(e)
            //  }}
            eventSettings={{ allowAdding: false, allowDeleting: false, allowEditing: false, dataSource: events }} >
            <ResourcesDirective>
                <ResourceDirective field='OwnerId' title='Owner' name='Owners'
                    dataSource={ownerData}
                    textField="OwnerText" idField='Id' colorField='OwnerColor'>
                </ResourceDirective>
            </ResourcesDirective>
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
       

        </div>);
}
export default Calendar;

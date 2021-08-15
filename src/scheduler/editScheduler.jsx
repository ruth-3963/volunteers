import React, { cloneElement, useEffect, useRef, useState } from 'react';
import axios from "axios";
import serverURL from "../serverURL";
import './CalendarStyles.css'
import Button from "react-bootstrap/Button";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

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
import { ScheduleComponent, Day, Week, WorkWeek, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent, TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useLocation, useHistory } from "react-router-dom"

const EditScheduler = () => {
    const location = useLocation();
    const calendar = useRef();
    //const [events, setEvents] = useState([]);
    const [group, setGroup] = useState(location.state.group);
    const history = useHistory();
    const sendData = async () => {
        const events = calendar.current.eventsData;
        const result = await axios.put("" + serverURL + "api/Event", {
            events: events,
            group: group
        });
        console.log(result);
        debugger;
        setGroup({ ...group, ['events']:JSON.stringify(events) });

        //calendar.current.eventsData = [];
        calendar.current.eventsData.forEach(event => {
            calendar.current.deleteEvent(event.Id);
        });
        history.push({ pathname: "/schedule", state: { events: group.events, group: group } });

    }
    const editorTemplate = (props) => {
        return (props !== undefined ? <table className="custom-event-editor" value="123" style={{ width: '100%', cellpadding: '5' }}><tbody>
            <tr><td className="e-textlabel">Title</td><td colSpan={4}>
                <input id="title" className="e-field e-input" type="text" name="title" style={{ width: '100%' }} disabled={true}
                    value="volunteer time" />
            </td></tr>

            <tr><td className="e-textlabel">From</td><td colSpan={4}>
                <TimePickerComponent  format={{ skeleton: 'Hms' }} />
            </td></tr>
            <tr><td className="e-textlabel">To</td><td colSpan={4}>
                <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field"></DateTimePickerComponent>
            </td></tr>
        </tbody></table> : <div></div>);
    }
    const header = () =>{
        return ( <><button id="close" className="e-close e-close-icon e-icons" title="Close" onClick={()=>calendar.current.closeQuickInfoPopup()}/>
        <h4>add volunteer time</h4></>);

    }
    const content = () =>{
        return (<div>
            <TimePickerComponent  placeholder="from" format={{ skeleton: 'Hms' }} />
            <TimePickerComponent placeholder="to" format={{ skeleton: 'Hms' }} />
        </div>);
    }
     
    return (<div><ButtonComponent onClick={() => sendData()} variant="link" >save schedule</ButtonComponent>
        <ScheduleComponent ref={calendar} width='100%' height='550px' eventSettings={{ dataSource: JSON.parse(group.events) }}
            editorTemplate={(e) => editorTemplate(e)} quickInfoTemplates={{ header: header, content: content}}>       
            <Inject services={[Day, Week, WorkWeek, Month]} />
        </ScheduleComponent></div >);

}
export default EditScheduler;
//quickInfoTemplates={{ header: this.header.bind(this), content: this.content.bind(this), footer: this.footer.bind(this) }}
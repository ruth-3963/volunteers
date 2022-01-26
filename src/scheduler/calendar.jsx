import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose, ResourcesDirective, ResourceDirective, } from '@syncfusion/ej2-react-schedule';
import {  useParams } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
import { GroupContext, UserContext, userToGroupContext } from '../App';
import { useErrorHandler } from 'react-error-boundary';
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


const Calendar = (props) => {
    const { id } = useParams();
    const calendar = useRef(1);
    const [events, setEvents] = useState([]);
    const [ownerData, setOwnerData] = useState([]);
    const { user } = useContext(UserContext);
    const { group } = useContext(GroupContext);
    const { userToGroup} = useContext(userToGroupContext);
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
        if (args.requestType === 'toolbarItemRendering') {
            if (userToGroup && userToGroup.is_manager) {
                let userIconItem = {
                    align: 'Center', text: 'edit schedule',
                    cssClass: 'e-schedule-user-icon',
                    template: `<a href="/chooseEvents/${userToGroup.group_id}" class="nav-link">Choose events</a>`,
                };
                args.items.push(userIconItem);
            }
        }
    }
    const addComments = (event) => {
        const comment = prompt("Please enter your comment:", "");
        event = {...event,Description:comment}      
        calendar.current.saveEvent(event);
        return;

    }
    const cancelVolunteer = (args) => {
        const event = {...event,OwnerId:null};
        calendar.current.saveEvent(event);
    }
    const footerTemplate = (args) => {
        return <div> 
            {args.OwnerId && args.OwnerId == user.id  &&
            <Button variant='link' onClick={() => cancelVolunteer(args)}>cancel</Button>} 
            <Button variant='link'
                onClick={() => addComments(args)}
                style={{ display: "unset !important", float: "left" }}> add commnt</Button>
        </div>
    }
    return (
        <div>
            <ScheduleComponent ref={calendar} width='100%' height='100%'        
                quickInfoTemplates={{
                    footer: (e) => footerTemplate(e)
                }}
                eventSettings={{
                    allowAdding: false, allowDeleting: false,  dataSource: events
                }} actionBegin={onActionBegin}  >
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

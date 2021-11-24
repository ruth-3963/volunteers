import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
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
import { useContext } from 'react';
import { UserContext } from "./../App"
import { BsImageFill } from 'react-icons/bs';
import { Description } from '@material-ui/icons';
const EditScheduler2 = () => {
  const calendar = useRef();
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [newEvents, setNewEvents] = useState([]);
  const [updateEvents, setUpdateEvents] = useState([]);
  const [deletedEvents, setDeletedEvents] = useState([]);
  const { user, setUser } = useContext(UserContext);

  useEffect(async () => {
    const result = await axios.get("" + serverURL + "api/Event/" + id);
    if (result.data) {
      setEvents(result.data);
    }
  }, []);

  const sendData = async () => {
    let localUser = JSON.parse(localStorage.getItem("user"));
    let localGroup = JSON.parse(localStorage.getItem("group"));
    await axios.post("" + serverURL + "api/Event", { events: newEvents, group: localGroup });
    const newUpdate = updateEvents.map(({ Id, OwnerId ,EndTimezone,IsAllDay,RecurrenceRule,StartTimezone ,...allProp }) => allProp);
     await axios.put("" + serverURL + "UpdateEvents/", { newUpdate });
    const newDel = deletedEvents.map(({ Id, OwnerId ,...allProp }) => allProp);
    await axios.delete("" + serverURL + "api/Event", { data: newDel }, { "Authorization": "***" });
    const result = await axios.get("" + serverURL + "api/Event", { params: { id: localGroup.id } });
    setEvents(result.data);
  }
  const onActionComplete = (args) => {
  
    if (args.addedRecords || args.changedRecords || args.deletedRecords) {
      const data = args.data[0];
      if (args.addedRecords.length > 0) {
        setNewEvents([...newEvents, data]);
        setEvents(calendar.current.eventsData);
        return;
      }
      if (args.changedRecords.length > 0) {
        if (data.id) {
          if (updateEvents.find(e => e.id === data.id)) {
            const index1 = updateEvents.indexOf(updateEvents.find(x => x.Id === data.Id));
            const newUpdateEvents = [...updateEvents];
            newUpdateEvents[index1] = data;
            setUpdateEvents(newUpdateEvents);
          }
          else { setUpdateEvents([...updateEvents, data]) };
        }
        else {
          const currEventsToUpdate = [...newEvents];
          const index = currEventsToUpdate.indexOf(currEventsToUpdate.find(x => x.Id === data.Id));
          currEventsToUpdate[index] = data;
          setNewEvents(currEventsToUpdate);
        }
        return;
      }
      if (args.deletedRecords.length > 0 && data.id) {
        setDeletedEvents([...deletedEvents, data]);
      }
    }

  }
  const onActionBegin = (args) => {
    if (args.changedRecords) {
      setEvents(calendar.current.eventsData);  
    }
  }
  return (<div><ButtonComponent onClick={() => sendData()} variant="link" > save schedule</ButtonComponent>
    <ScheduleComponent ref={calendar} actionBegin={(args) => onActionBegin(args)} actionComplete={(args) => onActionComplete(args)} width='100%' height='550px' eventSettings={{ dataSource: events }} >
      <Inject services={[Day, Week, WorkWeek, Month]} />
    </ScheduleComponent></div >);
}
export default EditScheduler2;

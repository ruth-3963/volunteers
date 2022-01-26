import React, { useEffect, useRef, useState } from 'react';
import useStateWithCallback from "use-state-with-callback";
import { useParams } from 'react-router';
import axios from "axios";
import serverURL from "../serverURL";
import '../App.css'
import './CalendarStyles.css'
import Button from "react-bootstrap/Button";
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
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
import { ScheduleComponent, Day, Week, WorkWeek, Month, Inject, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, popupOpen } from '@syncfusion/ej2-react-schedule';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent, TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useLocation, useHistory } from "react-router-dom"
import { useContext } from 'react';
import { GroupContext, UserContext, userToGroupContext } from "../App"
import { BsImageFill } from 'react-icons/bs';
import { Description } from '@material-ui/icons';
import ChooseDate from './chooseDate';
import { useErrorHandler } from 'react-error-boundary';
import {L10n} from '@syncfusion/ej2-base';
L10n.load({
  'en-US': {
      'schedule': {
          'newEvent': 'Add Shift',
      },
  }
});
const EditScheduler2 = () => {
  const calendar = useRef();
  const { id } = useParams();
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [newEvents, setNewEvents] = useState([]);
  const [updateEvents, setUpdateEvents] = useState([]);
  const [deletedEvents, setDeletedEvents] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const { group, setGroup } = useContext(GroupContext);
  const [showDateAlert, setShowDateAlert] = useState(false)
  const handleError = useErrorHandler();
  const [rangeDates, setRangeDates] = useStateWithCallback([], value => {
    if (value.length) {
      const eventsToCalc = calendar.current.eventsData.
        filter(e => e.StartTime > Date.parse(value[0]) && e.EndTime < Date.parse(value[1]));
      setShowDateAlert(false);
      CalcEvents(eventsToCalc);
    }
  });
  const [isDisplayEvents, setIsDisplayEvents] = useStateWithCallback(false, value => {
    if (value) {
      const eventsToCalc = calendar.current.getCurrentViewEvents();
      setShowDateAlert(false);
      CalcEvents(eventsToCalc);
    }
  });

  useEffect(async () => {
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
      setOwnerData(result.data.filter(od => !od.IsDeleted));
    } catch (err) {
      handleError(err)
    }
  }, []);

  const sendData = async () => {
    try {
      await axios.post(serverURL + "api/Event", { events: newEvents, group: group });
      const newUpdate = updateEvents.map(({ Id, OwnerId, EndTimezone, IsAllDay, RecurrenceRule, StartTimezone, ...allProp }) => allProp);
      await axios.put(serverURL + "UpdateEvents/", newUpdate);
      const newDel = deletedEvents.map(({ Id, OwnerId, ...allProp }) => allProp);
      await axios.delete(serverURL + "api/Event", { data: newDel }, { "Authorization": "***" });
      const result = await axios.get(serverURL + "api/Event", { params: { id: group.id } });
      setEvents(result.data);
      setShowToast(true);
    }
    catch (err) {
      handleError(err);
    }
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
    if (args.requestType == "eventCreate") {
      args.data[0].OwnerId = null;
    }
  }
  const CalcEvents = async (eventsToCalc) => {
    if (eventsToCalc && eventsToCalc.length) {
      try {
        const result = await axios.post(serverURL + "calcEvents", {
          events: eventsToCalc
        })
        setEvents(result.data);
      }
      catch (err) {
        handleError(err)
      }
    }
    else {
      alert("no events to calc")
    }
    setIsDisplayEvents(false);
    setRangeDates([]);
  }

  return (<>
    <ChooseDate
      setShowDateAlert={(val) => setShowDateAlert(val)}
      showDateAlert={showDateAlert}
      calendar={calendar.current}
      calc={(val) => CalcEvents(val)}
    />
    <ToastContainer style={{ position: 'relative' }} className="p-3" position="top-end">
      <Toast onClose={() => setShowToast(false)} show={showToast}
      // delay={3000} autohide
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>המידע נשמר בהצלחה</Toast.Body>
      </Toast>
    </ToastContainer>
    <ButtonComponent onClick={() => sendData()} variant="link" > save schedule</ButtonComponent>
    <ButtonComponent onClick={() => setShowDateAlert(true)}>calc events </ButtonComponent> <ButtonComponent onClick={() => history.push("/addVolunteers")} variant="link" > add volunteers </ButtonComponent>
    <ScheduleComponent
      ref={calendar}
      actionBegin={(args) => onActionBegin(args)}
      actionComplete={(args) => onActionComplete(args)}
      width='100%' height='550px'
      eventSettings={{
        dataSource: events,
        fields: {
          subject: { title: 'Shift Name' },
          description:{title:'Comments'}
        }
      }} >
      <ResourcesDirective>
        <ResourceDirective field='OwnerId' title='Volunteer'
          dataSource={ownerData}
          textField="OwnerText" idField='Id' colorField='OwnerColor'>
        </ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, WorkWeek, Month]} />
    </ScheduleComponent></>);
}
export default EditScheduler2;

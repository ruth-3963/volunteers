import React, { useEffect, useRef, useState, ReactDOMServer } from 'react';
import useStateWithCallback from "use-state-with-callback";
import { useParams } from 'react-router';
import axios from "axios";
import { serverURL } from "../../config/config";
import { Toast } from 'react-bootstrap'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import '../../App.css'
import './CalendarStyles.css'
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
import { ScheduleComponent, Day, Week, WorkWeek, Month, Inject, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, popupOpen } from '@syncfusion/ej2-react-schedule';
import { useHistory } from "react-router-dom"
import { useContext } from 'react';
import { GroupContext, UserContext } from "../../App"
import ChooseDate from './chooseDate';
import { useErrorHandler } from 'react-error-boundary';
import { L10n } from '@syncfusion/ej2-base';

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
  const [dynamicOwnerData, setDynamicUserData] = useState([])
  const [showToast, setShowToast] = useState(false);
  const { group, setGroup } = useContext(GroupContext);
  const [addFlag ,setAddFlag] = useState(false);
  const [showDateAlert, setShowDateAlert] = useState(false);
  const handleError = useErrorHandler();

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
      const newOwnerData = result.data.filter(od => !od.IsDeleted);
      setOwnerData(newOwnerData);
      setDynamicUserData(newOwnerData)
    } catch (err) {
      handleError(err)
    }
  }, []);

  const sendData = async (e) => {
    try {
      const buttonId = e.originalEvent.target.id;
      let updateNewEvents = [];
      setNewEvents(currentState => { // Do not change the state by getting the updated state
        updateNewEvents = [...currentState];
        return currentState;
      })
      let updateUpdateEvents = [];
      setUpdateEvents(currentState => { // Do not change the state by getting the updated state
        updateUpdateEvents = [...currentState];
        return currentState;
      })
      let updateDeleteEvents = [];
      setDeletedEvents(currentState => { // Do not change the state by getting the updated state
        updateDeleteEvents = [...currentState];
        return currentState;
      })
      await axios.post(`${serverURL}SaveEvents/${group.id}`, updateNewEvents);
      const newUpdate = updateUpdateEvents.map(({ Id, EndTimezone, IsAllDay, RecurrenceRule, StartTimezone, ...allProp }) => allProp);
      await axios.put(serverURL + "UpdateEvents/", newUpdate);
      const newDel = updateDeleteEvents.map(({ Id, EndTimezone, IsAllDay, RecurrenceRule, StartTimezone, ...allProp }) => allProp);
      await axios.delete(serverURL + "deleteEvents/", {data:newDel});
      const result = await axios.get(serverURL + "api/Event/" + group.id);
      if (buttonId != "save") {
        axios.post(`${serverURL}api/Event/specialSave/${buttonId}`, group);
      }
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
    if (args.requestType === 'toolbarItemRendering') {
      args.items.push(
        {
          align: 'Center',
          cssClass: 'e-schedule-user-icon',
          template: `<Button class="btn btn-link">Calc shifts</Button>`,
          click: () => setShowDateAlert(true)
        },
        {
          align: 'Center',
          cssClass: 'e-schedule-user-icon',
          template: `<div aria-label="Basic example" role="group" class="btn-group">
          <button type="button" class="btn btn btn-outline-primary" id = "save">Save</button>
          <button type="button" class="btn btn btn-outline-primary" id = "send">Save and send</button>
          <button type="button" class="btn btn btn-outline-primary"  id = "requestInlay">Save and request inlay</button></div>`,
          click: sendData
        }
      );
    }
  }
  const CalcEvents = async (eventsToCalc) => {
    if (eventsToCalc && eventsToCalc.length) {
      try {
        debugger;
        const result = await axios.post(`${serverURL}calcEvents/${group.id}`,
          events
        )
        setEvents(result.data);
      }
      catch (err) {
        handleError(err)
      }
    }
    else {
      alert("no events to calc")
    }
  }

  const open = (e) => {
    if(addFlag){
      e.data.flag = true;
      setAddFlag(false);
    }
    if (e.type === 'Editor' && e.data && !e.data.flag) {
      let newDynamicData = [];
      if (e.data.eventToUserDTO) {
        const usersToThisEvent = e.data.eventToUserDTO.map(etu => etu.userId)
        newDynamicData = ownerData.map(d => {

          if (usersToThisEvent.length && usersToThisEvent.includes(d.Id)) {
            return { ...d, OwnerText: `${d.OwnerText}(allowed)` }
          }
          return { ...d, OwnerText: `${d.OwnerText} (not allowed)` }

        });
      }
      else {
        newDynamicData = ownerData.map(a => { return { ...a } });
      }
      setDynamicUserData(newDynamicData);
      e.cancel = true;
      e.data.flag = true;
      setTimeout(()=>{
        if(e.duration){
          setAddFlag(true);
          calendar.current.openEditor(e.data, 'Add',true);
        }
        else{
          calendar.current.openEditor(e.data, 'Save');
        }
      },50)
    }
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
        delay={3000} autohide
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>The data saved succesfully</Toast.Body>
      </Toast>
    </ToastContainer>
    <ScheduleComponent
      ref={calendar}
      actionBegin={(args) => onActionBegin(args)}
      actionComplete={(args) => onActionComplete(args)}
      width='100%' height='100%'
      popupOpen={open}
      eventSettings={{
        dataSource: events,
        fields: {
          subject: { title: 'Shift Name' },
          description: { title: 'Comments' }
        }
      }} >
      <ResourcesDirective>
        <ResourceDirective field='OwnerId' title='Volunteer' cssClassField='CssClass'
          dataSource={dynamicOwnerData}
          textField="OwnerText" idField='Id' colorField='OwnerColor'
        >
        </ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, WorkWeek, Month]} />
    </ScheduleComponent></>);
}
export default EditScheduler2;

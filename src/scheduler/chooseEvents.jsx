import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
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
import scheduleData from './datasource'
import axios from "axios";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose, ResourcesDirective, ResourceDirective, } from '@syncfusion/ej2-react-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useHistory, useLocation } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
import serverURL from '../serverURL';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import ChooseColor from '../group/chooseColor';
import { validateYupSchema } from 'formik';
const ownerData = [
  { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
  { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
  { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
  { OwnerText: 'Ruti', Id: 4, OwnerColor: 'red' },
  { OwnerText: 'Efrat', Id: 5, OwnerColor: 'green' },
  { OwnerText: 'Shira', Id: 6, OwnerColor: 'blue' }
];

const ChooseEvents = (props) => {
  const calendar = useRef(1);
  const { id } = useParams()
  const [events, setEvents] = useState([]);
  const [showColorAlert, setShowColorAlert] = useState(false);
  const [color ,setColor] = useState('');
  const [ownerData , setOwnerData] = useState([]);
  let localUser = JSON.parse(localStorage.getItem("user"));
  let localGroup = JSON.parse(localStorage.getItem("group"));
 
  useEffect(async () => {
    const result = await axios.get("" + serverURL + "api/Event/" + id);
    if (result.data) {
      setEvents(result.data);
    }
  }, []);
  useEffect(async () => {
    const result = await axios.get("" + serverURL + "api/UsersToGroups/", { params: { groupId: localGroup.id, userId: localUser.id } });
    if (result.data) {
      localStorage.setItem("userToGroup", JSON.stringify(result.data));
      if (!result.data.color) {
        setShowColorAlert(true);
      }
      else{
        setColor(result.data.color);
      }
     setOwnerData([{Id: localUser.id , OwnerColor: result.data.color ,OwnerText:localUser.name }]);
    }
  }, []);
  useEffect(()=>{
    if(color && JSON.parse(localStorage.getItem("userToGroup")) &&  JSON.parse(localStorage.getItem("userToGroup")).color){
      setOwnerData([{Id: localUser.id , OwnerColor: color ,OwnerText:localUser.name }]);
    }
  },[color])
  const saveData = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    let events = calendar.current.eventsData;
    let eventToUser = events.filter(e => e.OwnerId === userId).map(e => e.Id);
    const res = await axios.post("" + serverURL + "api/EventToUser", { 
      userId : userId,
      groupId : localGroup.id,
      events : eventToUser
    });
    console.log(calendar.current);
  }
  const onActionBegin = (args) => {
    if (args.changedRecords) {
      setEvents(calendar.current.eventsData);  
    }
  }
  const penPopUp = (args) => {
   const userId = JSON.parse(localStorage.getItem("user")).id;
    if (args.data.OwnerId !== userId) {
      args.data.OwnerId = ownerData[0].Id;
      calendar.current.saveEvent(args.data);
      args.cancel = true;
    }
    else {
      args.data.OwnerId = undefined;
      calendar.current.saveEvent(args.data);
      args.cancel = true;
    }
  }
  
  return (<div>

    <ButtonComponent variant="link" onClick={() => saveData()}> save schedule</ButtonComponent>
    <ScheduleComponent actionBegin={(args) => onActionBegin(args)} ref={c => calendar.current = c} width='100%' height='550px' eventSettings={{ allowAdding: false, dataSource: events }} popupOpen={(args) => penPopUp(args)}>
      <ResourcesDirective>
        <ResourceDirective field='OwnerId' title='Owner' name='Owners'dataSource={ownerData} textField="OwnerText"  idField='Id' colorField='OwnerColor'>
        </ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
    <ChooseColor
      showColorAlert = {showColorAlert}
      color = {color} setColor = {(val) => {setColor(val)}} 
      setShow = {(val) => setShowColorAlert(val)}
      setOwnerData = {(val) => setOwnerData(val)}  />
  </div>);
}
export default ChooseEvents;

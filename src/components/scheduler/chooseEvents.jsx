import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import axios from "axios";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose, ResourcesDirective, ResourceDirective, } from '@syncfusion/ej2-react-schedule';
import {serverURL} from '../../config/config';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import ChooseColor from '../group/chooseColor';
import { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { GroupContext, UserContext, userToGroupContext } from '../../App';
import { useErrorHandler } from 'react-error-boundary';
import './CalendarStyles.css';
import '../../App.css'
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

const ChooseEvents = (props) => {
  const calendar = useRef(1);
  const { id } = useParams()
  const [events, setEvents] = useState([]);
  const [showColorAlert, setShowColorAlert] = useState(false);
  const [color, setColor] = useState('');
  const [ownerData, setOwnerData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);
  const { userToGroup, setUserToGroup } = useContext(userToGroupContext);
  const handleError = useErrorHandler();
  useEffect(async () => {
    try {
      const result = await axios.get(serverURL + "api/Event/" + id);
      if (result.data) {
        setEvents(result.data);
        const today = new Date();
        setSelectedDate(result.data.find(e => e.EndTime > new Date()));
        let laterDate = Math.max.apply(null,result.data.map(e => Date.parse(e.StartTime)));
        laterDate = new Date(laterDate);
        setLastDate(laterDate > new Date() ? laterDate.toISOString().slice(0,10).replace(/-/g,"/"): null);
      }
    }
    catch (err) {
      handleError(err);
    }
  }, []);
  useEffect(async () => {
    try {
      const result = await axios.get(serverURL + "api/UsersToGroups/", { params: { groupId: group.id, userId: user.id } });
      if (result.data) {
        localStorage.setItem("userToGroup", JSON.stringify(result.data));
        setUserToGroup(result.data);
        if (!result.data.color) {
          setShowColorAlert(true);
        }
        else {
          setColor(result.data.color);
        }
        setOwnerData([{ Id: user.id, OwnerColor: result.data.color, OwnerText: user.name }]);
      }
    }
    catch (err) {
      handleError(err)
    }
  }, []);
  useEffect(() => {
    if (color && userToGroup && userToGroup.color) {
      setOwnerData([{ Id: user.id, OwnerColor: color, OwnerText: user.name }]);
    }
  }, [color]);
 
  const saveData = async () => {
    const userId = user.id;
    let events = calendar.current.eventsData;
    let eventToUser = events.filter(e => e.OwnerId === userId).map(e => e.id);
    axios.post(serverURL + "api/EventToUser", {
      userId: userId,
      groupId: group.id,
      events: eventToUser
    }).catch(err => handleError(err));
    console.log(calendar.current);
  }
  const onActionBegin = (args) => {
    if (args.changedRecords) {
      setEvents(calendar.current.eventsData);
    }
    if (args.requestType === 'toolbarItemRendering') {
      if (userToGroup && userToGroup.is_manager) {
          let userIconItem = {
              align: 'Center', 
              text: 'save',
              cssClass: 'e-schedule-user-icon',
              template: `<Button class="btn btn-link">Save</Button>`,
              click: saveData
            };
          args.items.push(userIconItem);
      }
  }
  }
  const penPopUp = (args) => {
    const userId = user.id;
    if (args.data.OwnerId !== userId) {
      args.data.OwnerId = ownerData[0].Id;
      calendar.current.saveEvent(args.data);
    }
    else {
      args.data.OwnerId = undefined;
      calendar.current.saveEvent(args.data);
    }
    args.cancel = true;
  }

  return (<div>
     <Alert>
      <b>{lastDate ? `the last Date to choose is ${lastDate}`:`no events to choose`}</b> 
    </Alert>
    <ScheduleComponent
      actionBegin={(args) => onActionBegin(args)}
      ref={c => calendar.current = c}
      width='100%' height='550px'
      eventSettings={{ dataSource: events }}
      popupOpen={(args) => penPopUp(args)}
      selectedDate={selectedDate?selectedDate:new Date()}
    >
      <ResourcesDirective>
        <ResourceDirective field='OwnerId' title='Owner' name='Owners' dataSource={ownerData} textField="OwnerText" idField='Id' colorField='OwnerColor'>
        </ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
    <ChooseColor
      showColorAlert={showColorAlert}
      color={color} setColor={(val) => { setColor(val) }}
      setShow={(val) => setShowColorAlert(val)}
      setOwnerData={(val) => setOwnerData(val)}
      group={group} />
  </div>);
}
export default ChooseEvents;

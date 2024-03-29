import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import axios from "axios";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, popupClose, ResourcesDirective, ResourceDirective, } from '@syncfusion/ej2-react-schedule';
import { serverURL } from '../../config/config';
import { useContext } from 'react';
import { Alert ,Toast,ToastContainer} from 'react-bootstrap';
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
  const [ownerData, setOwnerData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);
  const { userToGroup } = useContext(userToGroupContext);
  const handleError = useErrorHandler();
  useEffect(() => {
    try {
     
      axios.get(serverURL + "api/EventToUser" ,{
        params:{
          userId:user.id,
          groupId:group.id
        }
      }).then(result => {
        if (result.data) {
          setEvents(result.data);
          const today = new Date();
          setSelectedDate(result.data.find(e => e.EndTime > new Date()));
          let laterDate = Math.max.apply(null, result.data.map(e => Date.parse(e.StartTime)));
          laterDate = new Date(laterDate);
          setLastDate(laterDate > new Date() ? laterDate.toISOString().slice(0, 10).replace(/-/g, "/") : null);
          if (userToGroup && userToGroup.color) {
            setOwnerData([{ Id: user.id, OwnerColor: userToGroup.color, OwnerText: user.name }]);
          }
        }
      });
     
    }
    catch (err) {
      handleError(err);
    }
  }, []);
  const saveData = async () => {
    const userId = user.id;
    let events = calendar.current.eventsData;
    let eventToUser = events.filter(e => e.OwnerId === userId).map(e => e.id);
    axios.post(serverURL + "api/EventToUser", {
      userId: userId,
      groupId: group.id,
      events: eventToUser
    }).then(res => setShowToast(true)).catch(err => handleError(err));
    console.log(calendar.current);
  }
  const onActionBegin = (args) => {
    if (args.changedRecords) {
      setEvents(calendar.current.eventsData);
    }
    if (args.requestType === 'toolbarItemRendering') {
     
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
      <b>{lastDate ? `the last Date to choose is ${lastDate}` : `no events to choose`}</b>
    </Alert>
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
      actionBegin={(args) => onActionBegin(args)}
      ref={c => calendar.current = c}
      width='100%' height='100%'
      eventSettings={{ dataSource: events }}
      popupOpen={(args) => penPopUp(args)}
      selectedDate={selectedDate ? selectedDate : new Date()}
    >
      <ResourcesDirective>
        <ResourceDirective field='OwnerId' title='Owner' name='Owners' dataSource={ownerData} textField="OwnerText" idField='Id' colorField='OwnerColor'>
        </ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
  </div>);
}
export default ChooseEvents;

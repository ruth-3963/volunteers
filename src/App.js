import React from 'react'

import Scheduler from './scheduler/Scheduler';
import Calendar from './scheduler/calendar2';
import SignIn from './login/SignIn'
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateGroup from './group/create_group';
import Group from './group/group';
import AddVolunteer from './group/addVolunteer';
import Demo from './scheduler/calendarDevExpress';
import EditScheduler from "./scheduler/editScheduler";

//import WeekCalender from './scheduler/weekCalender';
const App = () => {

  return (
    <>
      <Link to="/signin">SignIn</Link>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/createGroup" component={CreateGroup} />
        <Route path="/group" component={Group} />
        <Route path="/addVolunteer" component={AddVolunteer} />
        <Route path="/schedule" component={Calendar}/>
        <Route path="/editSchedule" component={EditScheduler}/>
      </Switch>
    </>
  )

}
export default App;
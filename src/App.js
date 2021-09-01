import React, { createContext, useState, useEffect }  from 'react'

import Scheduler from './scheduler/Scheduler';
import Calendar from './scheduler/calendar2';
import SignIn from './login/SignIn';
import SignUp from './login/signUp'
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
const userContext = React.createContext({user: {}});
const groupContext = createContext();
const App = () => {
  const [user ,setUser] = useState({});
  useEffect(() => {
    const userLocalStorage = localStorage.getItem("user");
    if(userLocalStorage)
      setUser(userLocalStorage)
  },[]);
  return (
    <userContext.Provider value={user}>
      <Link to="/signin">SignIn</Link>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/createGroup" component={CreateGroup} />
        <Route path="/group" component={Group} />
        <Route path="/addVolunteer" component={AddVolunteer} />
        <Route path="/schedule" component={Calendar}/>
        <Route path="/editSchedule" component={EditScheduler}/>
      </Switch>
    </userContext.Provider>
  )

}
export default App;
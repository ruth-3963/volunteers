import React, { createContext, useState, useEffect } from 'react'

import Scheduler from './scheduler/Scheduler';
import Calendar from './scheduler/goodCalendar';
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
import EditScheduler2 from './scheduler/editScheduer2';
import ChooseEvents from './scheduler/chooseEvents';
import Button from 'react-bootstrap/esm/Button';
import { SignalWifiOffOutlined } from '@material-ui/icons';
import { useHistory, useLocation,Redirect } from "react-router-dom";
import CSS_COLOR_NAMES from './colors';
import { Dropdown } from 'react-bootstrap';
//import WeekCalender from './scheduler/weekCalender';
export const UserContext = React.createContext({ user: {} });
const groupContext = createContext();
const App = () => {
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const history = useHistory();
  const [localGroup ,setLocalGroup] = useState();
  useEffect(() => {
    const group = JSON.parse(localStorage.getItem("group"));
    if(group && group.id){
      setLocalGroup(group);
      setIsLogin(true);
    }
  },[]);
  const signOut = () => {
    localStorage.setItem("user", null);
    localStorage.setItem("group", null);
    localStorage.setItem("userToGroup", null);
    setIsLogin(false);
    history.push("/");
  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {
        isLogin ? <Button variant="link" onClick={(e) => signOut()}>Sign out</Button> :
          <Link to="/signin">SignIn</Link>
      }
      <Switch>
        <Route exact path="/">
          {isLogin && localGroup && localGroup.id ? <Redirect to={`~/schedule/${localGroup.id}`} /> :
           <Redirect push to="/signin" render={({ match }) => <SignIn isLogin={isLogin} setIsLogin={(val) => setIsLogin(val)} />}/>}
        </Route>
      
        <Route exect path="/signin" render={({ match }) => <SignIn isLogin={isLogin} setIsLogin={(val) => setIsLogin(val)} />} />
        <Route exect path="/signup" component={SignUp} />
        <Route exect path="/createGroup" component={CreateGroup} />
        <Route exect path="/group" component={Group} />
        <Route exect path="/addVolunteer" component={AddVolunteer} />
        <Route exect path="/chooseEvents/:id" component={ChooseEvents} />
        <Route exect path="/editSchedule/:id" component={EditScheduler2} />
        <Route exect path="/schedule/:id" component={Calendar} />
      </Switch>
    </UserContext.Provider>
  )

}
export default App;
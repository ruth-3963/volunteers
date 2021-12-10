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
import { useHistory, useLocation } from "react-router-dom";
import CSS_COLOR_NAMES from './colors';
import { Dropdown } from 'react-bootstrap';
//import WeekCalender from './scheduler/weekCalender';
export const UserContext = React.createContext({ user: {} });
const groupContext = createContext();
const App = () => {
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const history = useHistory();
  useEffect(() => {
    const userLocalStorage = localStorage.getItem("user");
    if(JSON.parse(userLocalStorage))
      setIsLogin(true)
    else {
      history.push("/signin");
    }
  }, [isLogin]);
  const signOut = () => {
    localStorage.setItem("user", null);
    localStorage.setItem("group", null);
    localStorage.setItem("userToGroup",null);
    setIsLogin(false);
    history.push("/signin");
  }
  return (
    <UserContext.Provider value={{user,setUser}}>
      {
        isLogin ? <Button variant="link" onClick={(e) => signOut()}>Sign out</Button> :
          <Link to="/signin">SignIn</Link>
      }
      <Switch>
        <Route exact path="/" component={Calendar} />
        <Route path="/signin" render={({ match }) => <SignIn isLogin={isLogin} setIsLogin={(val) => setIsLogin(val)} />} />
        <Route path="/signup" component={SignUp} />
        <Route path="/createGroup" component={CreateGroup} />
        <Route path="/group" component={Group} />
        <Route path="/addVolunteer" component={AddVolunteer} />
        <Route path="/chooseEvents/:id" component={ChooseEvents} />
        <Route path="/editSchedule/:id" component={EditScheduler2} />
      </Switch>
    </UserContext.Provider>
  )

}
export default App;
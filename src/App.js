import React, { createContext, useState, useEffect ,useMemo} from 'react'
import TopBar from './topBar'
import Calendar from './scheduler/goodCalendar';
import SignIn from './login/SignIn';
import SignUp from './login/signUp';
import Profile from './group/profile/profile';
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
import { useHistory, useLocation, Redirect } from "react-router-dom";
export const UserContext = React.createContext({ user: {}, setUser: () => { } });
export const GroupContext = React.createContext({ group: {}, setGroup: () => { } })
export const userToGroupContext = React.createContext({ userToGroup: {}, setUserToGroup: () => { } });
const groupContext = createContext();
const App = () => {
  const [user, setUser] = useState({});
  const [group, setGroup] = useState({});
  const [userToGroup, setUserToGroup] = useState({});
  const userValue = useMemo( () => ({ user, setUser }),[user]);
  const groupValue = useMemo( () => ({ group, setGroup }),[user]);
  const userToGroupValue = useMemo( () => ({ userToGroup, setUserToGroup }),[user]); 
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    debugger;
    const localGroup = JSON.parse(localStorage.getItem("group"));
    const localUser = JSON.parse(localStorage.getItem("user"));
    const localUserToGroup = JSON.parse(localStorage.getItem("userToGroup"));
    if (localGroup) { 
      setGroup(localGroup);
      setIsLogin(true)
    }
    if(localUser) setUser(localUser);
    if(localUserToGroup) setUserToGroup(localUserToGroup);
    setIsLoading(true)
  }, []);
  const signOut = () => {
    localStorage.setItem("user", null);
    localStorage.setItem("group", null);
    localStorage.setItem("userToGroup", null);
    setUser(null); setGroup(null); setUserToGroup(null);
    setIsLogin(false);
    history.push("/");
  }
  return (
    <UserContext.Provider value={userValue}>
      <GroupContext.Provider value={groupValue}>
        <userToGroupContext.Provider value={userToGroupValue}>
           {isLoading && <><TopBar isLogin = {isLogin} signOut = {() => signOut()}></TopBar>
          <Switch>
            <Route exact path="/">
              {isLogin && group && group.id ? <Redirect to={`/schedule/${group.id}`} /> :
                <Redirect push to="/signin" />}
            </Route>

            <Route exect path="/signin" render={() => <SignIn isLogin={isLogin} setIsLogin={(val) => setIsLogin(val)} />} />
            <Route exect path="/signup" component={SignUp} />
            <Route exect path="/createGroup" component={CreateGroup} />
            <Route exect path="/group" component={Group} />
            <Route exect path="/addVolunteer" component={AddVolunteer} />
            <Route exect path="/chooseEvents/:id" component={ChooseEvents} />
            <Route exect path="/editSchedule/:id" component={EditScheduler2} />
            <Route exect path="/schedule/:id" component={Calendar} />
            <Route exect path="/profile" component={Profile} />
          </Switch></>
          }
        </userToGroupContext.Provider>
      </GroupContext.Provider>
    </UserContext.Provider>
  )

}
export default App;
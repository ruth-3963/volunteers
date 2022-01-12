import React, { createContext, useState, useEffect, useMemo, useReducer } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ErrorBoundary } from 'react-error-boundary'
import TopBar from './components/topBar'
import Calendar from './scheduler/goodCalendar';
import SignIn from './login/SignIn';
import SignUp from './login/signUp';
import { Profile } from './group/profile/profile';
import {Home} from './components/home'
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Fallback } from './components/fallBack';
import CreateGroup from './group/create_group';
import Group from './group/group';
import AddVolunteer from './group/addVolunteer';
import EditScheduler2 from './scheduler/editScheduer2';
import ChooseEvents from './scheduler/chooseEvents';
import ProtectedRoute from './components/protectedRoute';
import { ResetPassword } from './login/resetPassword';
import Button from 'react-bootstrap/esm/Button';
import { useHistory, useLocation, Redirect, prot } from "react-router-dom";
import { PortableWifiOffRounded } from '@material-ui/icons';
import ForgetPassword from './login/forgetPassword';
export const UserContext = React.createContext({ user: {}, setUser: () => { } });
export const GroupContext = React.createContext({ group: {}, setGroup: () => { } })
export const userToGroupContext = React.createContext({ userToGroup: {}, setUserToGroup: () => { } });
const groupContext = createContext();
const App = () => {
  const [user, setUser] = useState({});
  const [group, setGroup] = useState({});
  const [userToGroup, setUserToGroup] = useState({});
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const groupValue = useMemo(() => ({ group, setGroup }), [group]);
  const userToGroupValue = useMemo(() => ({ userToGroup, setUserToGroup }), [userToGroup]);
  const [isLogin, setIsLogin] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const forceUpdate = useReducer(() => ({}))[1];
  useEffect(() => {
    debugger;
    const localGroup = JSON.parse(localStorage.getItem("group"));
    const localUser = JSON.parse(localStorage.getItem("user"));
    const localUserToGroup = JSON.parse(localStorage.getItem("userToGroup"));
    if (localGroup) {
      setGroup(localGroup);
      setIsLogin(true)
    }
    if (localUser) setUser(localUser);
    if (localUserToGroup) setUserToGroup(localUserToGroup);
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
          <ErrorBoundary FallbackComponent={Fallback}
            onError={(error, errorInfo) => console.log({ error, errorInfo })}
            onReset={() => {
              forceUpdate();
            }}>
            {isLoading && <><TopBar isLogin={isLogin} signOut={() => signOut()}></TopBar>
              <Switch>
                <Route exact path="/">
                  {isLogin && group && group.id ? <Redirect to={`/schedule/${group.id}`} /> :
                    <Redirect push to="/signin" />}
                </Route>

                <Route exect path="/signin"
                  render={() =>

                    <SignIn isLogin={isLogin} setIsLogin={(val) => setIsLogin(val)} />

                  }
                />
                <Route path="/profile/:id"  render={({match,history}) => {
                  debugger;
                  return (user && user.id && match.params && match.params.id && match.params.id == user.id)
                        ? <Profile/> : history.goBack();
                }} />
                <Route exect path="/signup" component={SignUp} />
                <Route exect path="/home" component={Home}/>
                <Route exect path="/createGroup" component={CreateGroup} />
                <Route exect path="/group" component={Group} />
                <Route exect path="/addVolunteers" component={AddVolunteer} />
                <Route exect path="/forgetPassword" component={ForgetPassword} />
                <Route exact path="/reset/:token" component={ResetPassword} />
                <ProtectedRoute exect path="/chooseEvents/:id">
                  <ChooseEvents />
                </ProtectedRoute>
                <ProtectedRoute exect path="/editSchedule/:id">
                  <EditScheduler2 />
                </ProtectedRoute>
                <ProtectedRoute exect path="/schedule/:id">
                  <Calendar></Calendar>
                </ProtectedRoute>

              </Switch></>
            }
          </ErrorBoundary>
        </userToGroupContext.Provider>
      </GroupContext.Provider>
    </UserContext.Provider>
  )

}
export default App;
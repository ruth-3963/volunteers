import React, { createContext, useState, useEffect, useMemo, useReducer, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import TopBar from './components/topBar'
import { About } from './components/about'
import Calendar from './components/scheduler/calendar';
import SignIn from './components/login/SignIn';
import SignUp from './components/login/signUp';
import { Profile } from './components/profile/profile';
import { Home } from './components/home/home'
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Fallback } from './components/fallBack';
import CreateGroup from './components/group/create_group';
import Group from './components/group/group';
import AddVolunteer from './components/group/addVolunteer';
import EditScheduler2 from './components/scheduler/editScheduer';
import ChooseEvents from './components/scheduler/chooseEvents';
import ProtectedRoute from './components/protectedRoute';
import { ResetPassword } from './components/login/resetPassword';
import Button from 'react-bootstrap/esm/Button';
import { useHistory, useLocation, Redirect, prot } from "react-router-dom";
import { PortableWifiOffRounded } from '@material-ui/icons';
import ForgetPassword from './components/login/forgetPassword';
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

                <Route exect path="/signin/:email?/"
                  render={(props) =>
                    <SignIn {...props} isLogin={isLogin} setIsLogin={(val) => setIsLogin(val)} />

                  }
                />
                <Route path="/profile/:id" render={({ match, history }) => {
                  return (user && user.id && match.params && match.params.id && match.params.id == user.id)
                    ? <Profile /> : history.goBack();
                }} />
                <Route exect path="/signup/:email?/" component={SignUp} />
                <Route exect path="/home" component={Home} />
                <Route exect path="/about" component={About} />
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
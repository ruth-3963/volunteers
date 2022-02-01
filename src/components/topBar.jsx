import React, { useContext } from "react";
import logo from '../logo_min.jpg';
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button } from "react-bootstrap";
import '../index.css'
import { UserContext, userToGroupContext, GroupContext } from "../App";
const TopBar = (props) => {
    const { userToGroup, setUserToGroup } = useContext(userToGroupContext);
    const {group} = useContext(GroupContext);
    const location = useLocation();
    const checkCurrentLocation = (link) => {
        return location.pathname.includes(link);
    }
    return (
        <Navbar sticky="top" bg="light" expand="lg">
            <Container>
                <Navbar.Brand >EveryToOne</Navbar.Brand>
                <img src={logo} width="40" height="40" />

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-start">
                        <Nav.Link className={checkCurrentLocation('/home') && 'bgColorToCurrentLink'} 
                            href="/home">Home</Nav.Link>
                        <Nav.Link className={checkCurrentLocation('/about') && 'bgColorToCurrentLink'} 
                             href="/about">About</Nav.Link>
                        {userToGroup && userToGroup.user_id &&
                         <Nav.Link className={checkCurrentLocation('/profile') && 'bgColorToCurrentLink'}
                             href={`/profile/${userToGroup.user_id}`}>Profile</Nav.Link>}
                        {group &&
                        <Nav.Link className={checkCurrentLocation('/group') && 'bgColorToCurrentLink'}
                             href={`/group`}>Group</Nav.Link>}

                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse>
                    <Nav className="me-auto">

                        {userToGroup && userToGroup.is_manager && <>
                            <Nav.Link className={checkCurrentLocation('/editSchedule') && 'bgColorToCurrentLink'}
                                href={`/editSchedule/${userToGroup.group_id}`}>Edit Schedule</Nav.Link>
                            <Nav.Link className={checkCurrentLocation('/addVolunteers') && 'bgColorToCurrentLink'}
                                href={`/addVolunteers`}>Add volunteers</Nav.Link><span> </span> </>
                        }
                        {userToGroup &&  
                         <Nav.Link className={checkCurrentLocation('/schedule') && 'bgColorToCurrentLink'}
                                href={`/schedule/${userToGroup.group_id}`}>Schedule</Nav.Link>}

                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    {
                        props.isLogin ? <Button variant="link" onClick={() => props.signOut()}>Sign out</Button> :
                            <Link to="/signin">SignIn</Link>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default TopBar;
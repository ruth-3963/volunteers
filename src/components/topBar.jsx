import React, { useContext } from "react";
import logo from '../logo.png';
import { Navbar, Container , Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom';
import { Button } from "react-bootstrap";
import '../index.css'
import { userToGroupContext, GroupContext } from "../App";
const TopBar = (props) => {
    const { userToGroup } = useContext(userToGroupContext);
    const { group } = useContext(GroupContext);
    const location = useLocation();
    const checkCurrentLocation = (link) => {
        return location.pathname.includes(link);
    }
    return (
        <Navbar sticky="top" bg="light" expand="lg">
            <Container>
                <Navbar.Brand style={{padding :'0px 15px'}}> <img src={logo} width='100vh'/>
</Navbar.Brand>
               
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
                         <><Nav.Link className={checkCurrentLocation('/schedule') && 'bgColorToCurrentLink'}
                                href={`/schedule/${userToGroup.group_id}`}>Schedule</Nav.Link>
                                <Nav.Link className={checkCurrentLocation('/chooseEvents') && 'bgColorToCurrentLink'}
                                href={`/chooseEvents/${userToGroup.group_id}`}>Choose Shifts</Nav.Link>
                               </> }

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
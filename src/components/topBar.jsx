import React, { useContext } from "react";
import logo from '../logo_min.jpg';
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { UserContext, userToGroupContext, GroupContext } from "../App";
const TopBar = (props) => {
    const { userToGroup, setUserToGroup } = useContext(userToGroupContext);
    return (
        <Navbar sticky="top" bg="light" expand="lg">
            <Container>
                <Navbar.Brand >EveryToOne</Navbar.Brand>
                <img src={logo} width="40" height="40" />

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-start">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                       {userToGroup && userToGroup.user_id && <Nav.Link href={`/profile/${userToGroup.user_id}`}>Profile</Nav.Link>}

                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse>
                    <Nav className="me-auto">

                        {userToGroup && userToGroup.is_manager && <>
                            <Nav.Link href={`/editSchedule/${userToGroup.group_id}`}>Edit Schedule</Nav.Link>
                            <Nav.Link href={`/addVolunteers`}>Add volunteers</Nav.Link><span> </span>
                            <Nav.Link href={`/schedule/${userToGroup.group_id}`}>Schedule</Nav.Link></>
                        }
                        {userToGroup &&<Nav.Link href={`/chooseEvents/${userToGroup.group_id}`}>Choose events</Nav.Link>}

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
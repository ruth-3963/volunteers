import React,{useContext} from "react";
import logo from './logo_min.jpg';
import { Navbar, Container, NavDropdown, Nav } from 'react-bootstrap'
import {Link} from 'react-router-dom';
import { Button } from "react-bootstrap";
import { UserContext,userToGroupContext,GroupContext} from "./App";
const TopBar = (props) => {
    const { user, setUser } = useContext(UserContext);
    const { userToGroup, setUserToGroup } = useContext(userToGroupContext);
    const { group, setGroup } = useContext(GroupContext); 
    return (
        <Navbar sticky="top" bg="light" expand="lg">
            <Container>
                <Navbar.Brand >EveryToOne</Navbar.Brand>
                <img src={logo}  width="40" height="40"/>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-start">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">About</Nav.Link>
                        <Nav.Link href="#link">Profile</Nav.Link>

                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse>
                <Nav className="me-auto">
                    
                        {userToGroup && userToGroup.is_manager ? <><Nav.Link>Edit Schedule</Nav.Link><span> </span></> :null}
                        {userToGroup && userToGroup.is_manager ? <><Nav.Link >Add volunteers</Nav.Link><span> </span></>  :null}
                        {userToGroup && userToGroup.is_manager ? <><Nav.Link >Calc events</Nav.Link><span> </span></> :null}
                        {userToGroup ? <><Link to ="chooseEvents/18">Choose events</Link><span> </span></> :null}

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
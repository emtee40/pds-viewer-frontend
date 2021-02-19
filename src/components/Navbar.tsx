import React from 'react';
import {Nav, Navbar as BSNavbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const Navbar = () => (
    <BSNavbar fixed={'top'} bg="dark" variant="dark">
        <BSNavbar.Brand href="/">PDS Viewer</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav"/>
        <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Item>
                    <NavLink className={'nav-link'} to={'/help'}>Help</NavLink>
                </Nav.Item>
            </Nav>
        </BSNavbar.Collapse>
    </BSNavbar>
);

export default Navbar;

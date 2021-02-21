import React, {FunctionComponent} from 'react';
import {Nav, Navbar as BSNavbar, NavDropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import Favicon from '../assets/img/favicon-32x32.png';
import {FileMediaIcon, MoonIcon, SunIcon} from "@primer/octicons-react";

type Props = {
    setSelectedFormat: (format: string) => void,
    selectedFormat: string,

    setSelectedDesign: (format: string) => void,
    selectedDesign: string,
}

const Navbar: FunctionComponent<Props> = ({
                                              selectedFormat,
                                              setSelectedFormat,
                                              selectedDesign,
                                              setSelectedDesign
                                          }: Props) => {

    const setNewSelectedFormat = (format: string) => {
        setSelectedFormat(format);
        localStorage.setItem('selectedFormat', format);
    };

    const setNewSelectedDesign = (design: string) => {
        setSelectedDesign(design);
        localStorage.setItem('selectedDesign', design);
    };

    const formatDropdownTitle = (
        <span>
            <FileMediaIcon verticalAlign={'text-top'}/>
            {' ' + selectedFormat.toUpperCase()}
        </span>
    );

    const uiModeDropdownTitle = (selectedDesign === 'bright') ? (<SunIcon verticalAlign={'text-top'}/>) : (
        <MoonIcon verticalAlign={'text-top'}/>);

    return (
        <BSNavbar fixed={'top'} bg="dark" variant="dark">
            <BSNavbar.Brand href="/">
                <img
                    alt="A world emoji, the logo of this application."
                    src={Favicon}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}PDS Viewer
            </BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav"/>
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Item>
                        <NavLink className={'nav-link'} to={'/data'}>Data</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink className={'nav-link'} to={'/help'}>Help</NavLink>
                    </Nav.Item>
                </Nav>
                <Nav className="justify-content-end">
                    <NavDropdown title={uiModeDropdownTitle} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => setNewSelectedDesign("bright")}><SunIcon/>{' Light'}</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setNewSelectedDesign("dark")}><MoonIcon/>{' Dark'}</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={formatDropdownTitle} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => setNewSelectedFormat("png")}>PNG</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setNewSelectedFormat("gif")}>GIF</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setNewSelectedFormat("jpg")}>JPG</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
}

export default Navbar;

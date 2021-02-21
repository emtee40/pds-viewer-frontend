import React, {FunctionComponent} from 'react';
import {Nav, Navbar as BSNavbar, NavDropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import Favicon from '../assets/img/favicon-32x32.png';
import {FileMediaIcon, MoonIcon, SunIcon} from "@primer/octicons-react";
import {useTranslation} from "react-i18next";

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

    const {t} = useTranslation();

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
                    alt={t('nav.logo_alt')}
                    src={Favicon}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' ' + t('nav.app_name')}
            </BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav"/>
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Item>
                        <NavLink className={'nav-link'} to={'/data/'}>{t('nav.data')}</NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink className={'nav-link'} to={'/help'}>{t('nav.help')}</NavLink>
                    </Nav.Item>
                </Nav>
                <Nav className="justify-content-end">
                    <NavDropdown title={uiModeDropdownTitle} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => setNewSelectedDesign("bright")}><SunIcon/>{' ' + t('nav.light')}</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setNewSelectedDesign("dark")}><MoonIcon/>{' ' + t('nav.dark')}</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={formatDropdownTitle} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => setNewSelectedFormat("png")}>{t('nav.format.png')}</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setNewSelectedFormat("gif")}>{t('nav.format.gif')}</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setNewSelectedFormat("jpg")}>{t('nav.format.jpg')}</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
}

export default Navbar;

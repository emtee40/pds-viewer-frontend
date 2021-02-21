import React from 'react';
import {Container} from "react-bootstrap";

const HelpPage = () => (
    <Container>
        <h2>About</h2>
        <p>This application is a an explorer-like application intended for browsing the <a href={'https://pds-imaging.jpl.nasa.gov/'}>Planetary Data System</a> of NASA JPL.</p>
        <p>{'Browsing the PDS is also possible by just using a web browser but due to the responses taking relatively long, it\'s not very comfortable.'}</p>
        <p>{'This application aims to solve this by caching each response which makes revisiting folders and images much faster because there is actually no request to the PDS unless the requested resource is not yet cached, or the "reload" button is pressed.'}</p>
    </Container>
);

export default HelpPage;

import React from 'react';
import {Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";

const MainPage = () => (
    <Container>
        <h1>Welcome!</h1>
        <p>This is a viewer for the Planetary Data System of NASA JPL.</p>
        <Button variant="outline-primary">
            <Link to={'/data/'}>Start digging...</Link>
        </Button>
    </Container>
);

export default MainPage;

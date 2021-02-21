import React from 'react';
import {Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";

const MainPage = () => (
    <Container>
        <h2>Welcome!</h2>
        <p>This is a viewer for the Planetary Data System of NASA JPL.</p>
        <Button as={Link} to={'/data/'} variant="outline-primary">
            Start digging...
        </Button>
    </Container>
);

export default MainPage;

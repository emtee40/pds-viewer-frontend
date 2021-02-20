import React from 'react';
import {Container} from "react-bootstrap";

const MainPage = () => (
    <Container>
        <p>You can use this application to browse the NASA JPL PDS archive using a single page app that also supports
            deeplinking.</p>
        <p>The main advantage is that (most) images are rendered automatically instead of requiring the user to
            explicitly selecting the output mode or using the webifiable links.</p>
    </Container>
);

export default MainPage;

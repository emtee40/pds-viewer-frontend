import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import MainPage from "./pages/MainPage";
import DataPage from "./pages/DataPage";
import HelpPage from "./pages/HelpPage";
import Navbar from "./components/Navbar";
import FolderContent from "./components/FolderContent";
import {Container} from "react-bootstrap";

const App = () => {
    return (
        <>
            <Navbar />
            <Switch>
                <Route exact path="/">
                    <MainPage />
                </Route>
                <Route exact path={'/help'}>
                    <HelpPage />
                </Route>
                <Route exact path={'/data'}>
                    <Container>
                        <FolderContent path={''} />
                    </Container>
                </Route>
                <Route path={'/data/:path'}>
                    <DataPage />
                </Route>
                <Route render={() => <h1>Page not found</h1>}/>
            </Switch>
        </>
    );
};

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>, document.getElementById('app'));

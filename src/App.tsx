import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import MainPage from "./pages/MainPage";
import DataPage from "./pages/DataPage";
import HelpPage from "./pages/HelpPage";
import Navbar from "./components/Navbar";

const App = () => {

    const [selectedFormat, setSelectedFormat] = useState(() => localStorage.getItem('selectedFormat') || 'gif');
    const [selectedDesign, setSelectedDesign] = useState(() => localStorage.getItem('selectedDesign') || 'bright');

    if (selectedDesign === 'dark') {
        document.body.classList.add('app-theme-dark');
        document.body.classList.remove('app-theme-bright');
    } else {
        document.body.classList.add('app-theme-bright');
        document.body.classList.remove('app-theme-dark');
    }

    return (
        <>
            <Navbar
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                selectedDesign={selectedDesign}
                setSelectedDesign={setSelectedDesign}/>
            <Switch>
                <Route exact path="/">
                    <MainPage/>
                </Route>
                <Route exact path={'/help'}>
                    <HelpPage/>
                </Route>
                <Route exact path={'/data'}>
                    <DataPage selectedFormat={selectedFormat}/>
                </Route>
                <Route path={'/data/:path'}>
                    <DataPage selectedFormat={selectedFormat}/>
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

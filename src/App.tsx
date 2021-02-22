import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router';
import {BrowserRouter} from "react-router-dom";
import {initReactI18next, useTranslation} from 'react-i18next';

import MainPage from "./pages/MainPage";
import DataPage from "./pages/DataPage";
import HelpPage from "./pages/HelpPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import translation from "./i18n/en/translation.json";
import i18n from "i18next";

export const API_URL = "https://pds-imaging.jpl.nasa.gov/w10n/";

export const resources = {
    en: {
        translation,
    },
} as const;

i18n.use(initReactI18next).init({
    lng: 'en',
    resources,
});

const App = () => {

    const getInitialTheme = (): string => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'bright';
        }
    }

    const [selectedFormat, setSelectedFormat] = useState(() => localStorage.getItem('selectedFormat') || 'gif');
    const [selectedDesign, setSelectedDesign] = useState(() => localStorage.getItem('selectedDesign') || getInitialTheme());
    const [cached, setCached] = useState(false);
    const [imageCached, setImageCached] = useState(false);
    const [selectedFile, setSelectedFile] = useState('#no-selection');

    const { t } = useTranslation();

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
                    <DataPage selectedFile={selectedFile} setSelectedFile={setSelectedFile} imageCached={imageCached} setImageCached={setImageCached} cached={cached} setCached={setCached} selectedFormat={selectedFormat}/>
                </Route>
                <Route path={'/data/:path'}>
                    <DataPage selectedFile={selectedFile} setSelectedFile={setSelectedFile} imageCached={imageCached} setImageCached={setImageCached} cached={cached} setCached={setCached} selectedFormat={selectedFormat}/>
                </Route>
                <Route render={() => <h1>{t('header.page_not_found')}</h1>}/>
            </Switch>
            <Footer selectedFile={selectedFile} imageCached={imageCached} cached={cached} />
        </>
    );
};

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>, document.getElementById('app'));

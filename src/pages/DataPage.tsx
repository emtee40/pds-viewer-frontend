import React, {FunctionComponent, useEffect, useState} from 'react';
import {useLocation} from "react-router";
import {useHistory} from "react-router-dom";
import {Breadcrumb, Container} from "react-bootstrap";
import FolderContent from "../components/FolderContent";

type Props = {
    selectedFormat: string,
    cached: boolean,
    setCached: (cached: boolean) => void,
    imageCached: boolean,
    setImageCached: (imageCached: boolean) => void,
}

const DataPage: FunctionComponent<Props> = ({selectedFormat, cached, setCached, imageCached, setImageCached}: Props) => {
    const location = useLocation();
    const history = useHistory();

    const [currentPath, setCurrentPath] = useState(location.pathname.replace(/\/data/, ''));

    useEffect(() => {
        let tempPath = location.pathname.replace(/\/data/, '');
        if(tempPath.startsWith("/")) {
            tempPath = tempPath.substring(1);
        }
        setCurrentPath(tempPath);
    }, [location]);

    const splitPath = currentPath.split('/');

    function buildPath(idx, pathElem) {
        let fullPath = '/data/';
        for (let i = 0; i < idx; i++) {
            fullPath += splitPath[i] + '/';
        }
        fullPath += pathElem;
        return fullPath;
    }

    const breadcrumbs = splitPath.map((pathElem, idx) => {
        const href = buildPath(idx, pathElem);
        return (
            <Breadcrumb.Item key={idx} href={href} active={href === location.pathname}>{pathElem}</Breadcrumb.Item>
        );
    });

    const isOnPDSRoot = (): boolean => {
        return ('/data/' === location.pathname)
            || ('/data' === location.pathname);
    }

    const navigateToParent = () => {
        history.go(-1);
    }

    return (
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href={'/data/'} active={isOnPDSRoot()}>PDS Root</Breadcrumb.Item>
                {breadcrumbs}
            </Breadcrumb>
            <FolderContent imageCached={imageCached} setImageCached={setImageCached} cached={cached} setCached={setCached} navigateToParent={navigateToParent} selectedFormat={selectedFormat} path={currentPath}/>
        </Container>
    );
}

export default DataPage;

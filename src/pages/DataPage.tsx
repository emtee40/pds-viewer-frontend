import React, {FunctionComponent} from 'react';
import {useLocation} from "react-router";
import {Breadcrumb, Container} from "react-bootstrap";
import FolderContent from "../components/FolderContent";

type Props = {
    selectedFormat: string,
}

const DataPage: FunctionComponent<Props> = ({selectedFormat}: Props) => {
    const location = useLocation();

    const currentPath = location.pathname.replace(/\/data/, '');

    const splitPath = currentPath.split('/');
    splitPath.splice(0, 1); // remove first "/"

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

    return (
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href={'/data/'} active={isOnPDSRoot()}>PDS Root</Breadcrumb.Item>
                {breadcrumbs}
            </Breadcrumb>
            <FolderContent selectedFormat={selectedFormat} activeKey={location.hash} path={currentPath}/>
        </Container>
    );
}

export default DataPage;

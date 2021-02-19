import React, {FunctionComponent} from 'react';
import {useLocation, useParams, useRouteMatch} from "react-router";
import {Breadcrumb, Container} from "react-bootstrap";
import FolderContent from "../components/FolderContent";

type Props = {}

const DataPage: FunctionComponent<Props> = () => {
    const location = useLocation();

    const currentPath = location.pathname.replace(/\/data\//, '');

    const splitPath = currentPath.split('/');
    console.log(location);

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
    })

    return (
        <Container>
            <Breadcrumb>
                {breadcrumbs}
            </Breadcrumb>
            <FolderContent activeKey={location.hash} path={currentPath}/>
        </Container>
    );
}

export default DataPage;

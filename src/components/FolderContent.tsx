import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "./Loader";
import {Alert, Button, Col, Container, ListGroup, OverlayTrigger, Row, Tab, Tooltip} from "react-bootstrap";
import FileContent from "./FileContent";
import {FileDirectoryIcon, FileIcon, FileMediaIcon, SyncIcon} from "@primer/octicons-react";
import {API_URL} from "../App";
import NodeItem from "./folder-contents/NodeItem";
import {PDSNode} from "../types/PDSNode";
import {PDSLeaf} from "../types/PDSLeaf";
import NodeLeaf from "./folder-contents/NodeLeaf";
import Toolbar from "./file-contents/Toolbar";

type Props = {
    path: string,
    activeKey?: string,
    selectedFormat: string,
    navigateToParent: () => void,
}

const FolderContent: FunctionComponent<Props> = ({path, activeKey, selectedFormat, navigateToParent}: Props) => {

    const getCachedPath = (): PDSNode => {
        const cachedJson = localStorage.getItem('cache-' + (path === '' ? '/' : path));
        if (cachedJson != null && cachedJson.length > 0) {
            return JSON.parse(cachedJson);
        } else {
            return undefined;
        }
    }

    const [folderContent, setFolderContent] = useState(undefined);
    const [error, setError] = useState(false);
    const [cached, setCached] = useState(false);

    const apiUrl = API_URL + (path === '/' ? '' : path) + '/?output=json';

    const refreshCache = (): void => {
        setFolderContent(undefined);
        setError(false);
        fetch(apiUrl)
            .then(function (response) {
                if (response.status !== 200) {
                    setError(true);
                    throw new Error("Bad response from server for path: '" + path + "'!");
                }
                return response.json();
            })
            .then(function (content) {
                setFolderContent(content);
                localStorage.setItem('cache-' + path, JSON.stringify(content));
                setCached(false);
            });
    }

    useEffect(() => {
        const cached = getCachedPath();
        if (cached) {
            setFolderContent(cached);
            setCached(true);
        } else {
            refreshCache();
        }
    }, [path]);

    if (error) {
        return (
            <Alert variant={'danger'}>
                There was an error fetching data from the API!
            </Alert>
        );
    }

    if (!folderContent) {
        return (<Loader/>);
    }

    if (!folderContent.nodes && !folderContent.leaves) {
        return (
            <Alert variant={'info'}>
                This folder has no content!
            </Alert>
        );
    }

    const nodeItems = folderContent.nodes.map((node, idx) =>
        (<NodeItem node={node} key={idx} idx={idx} path={path}/>));

    const nodeLeaves = folderContent.leaves.map((leaf, idx) =>
        (<NodeLeaf path={path} leaf={leaf} idx={idx} key={idx}/>));

    const nodeLeafContents = folderContent.leaves.map((leaf, idx) => {
        const contentKey = '#' + leaf.name;
        return (
            <Tab.Pane key={idx} eventKey={contentKey}>
                <FileContent folderContent={folderContent}
                             path={path}
                             selectedFormat={selectedFormat}
                             leaf={leaf}
                             refreshFolderCache={refreshCache}
                             navigateToParent={navigateToParent}/>
            </Tab.Pane>
        );
    });

    return (
        <Tab.Container mountOnEnter={true} id="folder-content-tabs" defaultActiveKey={activeKey || '#no-selection'}>
            <Row>
                <Col lg={4}>
                    <ListGroup>
                        {nodeItems}
                        {nodeLeaves}
                    </ListGroup>
                </Col>
                <Col lg={8}>
                    <Tab.Content>
                        <Tab.Pane eventKey="#no-selection">
                            <div className="file-content">
                                <Toolbar navigateToParent={navigateToParent} refreshFolderCache={refreshCache}
                                         imageProps={undefined}/>
                                <Alert variant={'info'}>No file selected...</Alert>
                            </div>
                        </Tab.Pane>
                        {nodeLeafContents}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default FolderContent;

export const buildHref = (path: string, elem: PDSNode | PDSLeaf): string => {
    const prePathDelim = (path.startsWith('/') && path !== '/' ? '' : '/');
    const pathWithDelim = (path && path !== '/' ? path + '/' : '');
    return '/data' + prePathDelim + pathWithDelim + elem.name;
}

export const isLeafWebifiable = (leaf: PDSLeaf): boolean => {
    const webifiableAttr = leaf.attributes.find(a => a.name === 'webifiable');
    return (webifiableAttr && webifiableAttr.value) == true;
}

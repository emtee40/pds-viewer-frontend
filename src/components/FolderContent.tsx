import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "./Loader";
import {Alert, Col, ListGroup, Row, Tab} from "react-bootstrap";
import FileContent from "./FileContent";
import {API_URL} from "../App";
import NodeItem from "./folder-contents/NodeItem";
import {PDSNode} from "../types/PDSNode";
import {PDSLeaf} from "../types/PDSLeaf";
import NodeLeaf from "./folder-contents/NodeLeaf";
import Toolbar from "./file-contents/Toolbar";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

type Props = {
    path: string,
    selectedFormat: string,
    navigateToParent: () => void,
    cached: boolean,
    setCached: (cached: boolean) => void,
    imageCached: boolean,
    setImageCached: (imageCached: boolean) => void,
}

const FolderContent: FunctionComponent<Props> = ({
                                                     path,
                                                     selectedFormat,
                                                     navigateToParent,
                                                     cached,
                                                     setCached,
                                                     imageCached,
                                                     setImageCached
                                                 }: Props) => {

    const [folderContent, setFolderContent] = useState(undefined);
    const [activeKey, setActiveKey] = useState('#no-selection');
    const [error, setError] = useState(false);
    const {t} = useTranslation();

    const apiUrl = API_URL + (path === '/' ? '' : path) + '/?output=json';

    useEffect(() => {
        const cached = getCachedPath(path);
        if (cached) {
            setFolderContent(cached);
            setCached(true);
        } else {
            refreshCache(apiUrl, path, setFolderContent, setError, setCached, t);
        }
    }, [path]);

    if (error) {
        return (
            <Alert variant={'danger'}>
                {t('folder.error_fetching')}
            </Alert>
        );
    }

    if (!folderContent) {
        return (
            <Row className={'content'}>
                <Loader/>
            </Row>
        );
    }

    if (!folderContent.nodes && !folderContent.leaves) {
        return (
            <Alert variant={'info'}>
                {t('folder.no_content')}
            </Alert>
        );
    }

    const nodeItems = folderContent.nodes.map((node, idx) =>
        (<NodeItem node={node} key={idx} idx={idx} path={path}/>));

    const nodeLeaves = folderContent.leaves.map((leaf, idx) =>
        (<NodeLeaf activeKey={activeKey} setActiveKey={setActiveKey} leaf={leaf} idx={idx} key={idx}/>));

    const nodeLeafContents = folderContent.leaves.map((leaf, idx) => {
        return (
            <Tab.Pane key={idx} active={activeKey === leaf.name}>
                <FileContent folderContent={folderContent}
                             path={path}
                             selectedFormat={selectedFormat}
                             leaf={leaf}
                             refreshFolderCache={() => refreshCache(apiUrl, path, setFolderContent, setError, setCached, t)}
                             navigateToParent={() => navigateToParentFolder(setActiveKey, navigateToParent)}
                             imageCached={imageCached} setImageCached={setImageCached}/>
            </Tab.Pane>
        );
    });

    return (
        <Tab.Container unmountOnExit={true} mountOnEnter={true} id="folder-content-tabs" defaultActiveKey={activeKey}>
            <Row className={'content'}>
                <Col lg={4}>
                    <ListGroup className={'folder-content-list'}>
                        {nodeItems}
                        {nodeLeaves}
                    </ListGroup>
                </Col>
                <Col lg={8}>
                    <Tab.Content>
                        <Tab.Pane eventKey="#no-selection" active={activeKey === '#no-selection'}>
                            <div className="file-content">
                                <Toolbar navigateToParent={navigateToParent}
                                         refreshFolderCache={() => refreshCache(apiUrl, path, setFolderContent, setError, setCached, t)}
                                         imageProps={undefined}/>
                                <Alert variant={'info'}>{t('folder.no_selection')}</Alert>
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

const navigateToParentFolder = (setActiveKey: (activeKey: string) => void,
                                navigateToParent: () => void) => {
    setActiveKey('#no-selection');
    navigateToParent();
}

const refreshCache = (apiUrl: string,
                      path: string,
                      setFolderContent: (folderContent: string) => void,
                      setError: (error: boolean) => void,
                      setCached: (cached: boolean) => void,
                      t: TFunction): void => {
    setFolderContent(undefined);
    setError(false);
    fetch(apiUrl)
        .then(function (response) {
            if (response.status !== 200) {
                setError(true);
                throw new Error(t('folder.bad_response_for_path') + path + "'!");
            }
            return response.json();
        })
        .then(function (content) {
            setFolderContent(content);
            localStorage.setItem('cache-' + path, JSON.stringify(content));
            setCached(false);
        });
}

const getCachedPath = (path: string): PDSNode => {
    const cachedJson = localStorage.getItem('cache-' + (path === '' ? '/' : path));
    if (cachedJson != null && cachedJson.length > 0) {
        return JSON.parse(cachedJson);
    } else {
        return undefined;
    }
}

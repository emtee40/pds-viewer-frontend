import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "./Loader";
import {Alert, Col, Container, ListGroup, Row, Tab} from "react-bootstrap";
import FileContent from "./FileContent";
import {FileDirectoryIcon, FileIcon, FileMediaIcon} from "@primer/octicons-react";

type Props = {
    path: string,
    activeKey?: string,
    selectedFormat: string,
}

const FolderContent: FunctionComponent<Props> = ({path, activeKey, selectedFormat}: Props) => {

    const [folderContent, setFolderContent] = useState(undefined);
    const [error, setError] = useState(false);

    const apiUrl = 'https://pds-imaging.jpl.nasa.gov/w10n' + (path === '/' ? '' : path) + '/?output=json';

    useEffect(() => {
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
            });
    }, []);

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

    if (!folderContent.nodes) {
        return (
            <Alert variant={'info'}>
                There are no nodes!
            </Alert>
        );
    }

    const buildHref = (node): string => {
        const prePathDelim = (path.startsWith('/') && path !== '/' ? '' : '/');
        const pathWithDelim = (path && path !== '/' ? path + '/' : '');
        return '/data' + prePathDelim + pathWithDelim + node.name;
    }

    const nodeItems = folderContent.nodes.map((node, idx) => {
        const mTime = node.attributes.find((attr) => attr.name === 'mtime');
        return (
            <ListGroup.Item className={'folder-content-item'} key={idx} action
                            href={buildHref(node)}>
                <span className={'name'}>
                    <FileDirectoryIcon verticalAlign={'text-top'}/>{' '}
                    <span>{node.name}</span>
                </span>
                {mTime && <small className={'text-muted'}>{mTime.value}</small>}
            </ListGroup.Item>
        );
    });

    const isLeafWebifiable = (leaf) => {
        const webifiableAttr = leaf.attributes.find(a => a.name === 'webifiable');
        return (webifiableAttr && webifiableAttr.value) == true;
    }

    const nodeLeaves = folderContent.leaves.map((leaf, idx) => {
        const mTime = leaf.attributes.find((attr) => attr.name === 'mtime');
        const size = leaf.attributes.find((attr) => attr.name === 'size');
        const webifiable = isLeafWebifiable(leaf);

        const webifiableHref = buildHref(leaf);
        const fileViewHref = '#' + leaf.name;
        const href = (webifiable ? webifiableHref : fileViewHref);

        const fileIcon = (webifiable &&
            <FileMediaIcon verticalAlign={'text-top'}/> ||
            <FileIcon verticalAlign={'text-top'}/>)

        return (
            <ListGroup.Item className={'folder-content-item'} key={idx} action
                            href={href}>
                <span className={'name'}>
                    {fileIcon}{' '}
                    <span>{leaf.name}</span>
                </span>
                <span className={'details'}>
                    {size && <small className={'text-muted'}>{size.value + ' bytes'}</small>}
                    {mTime && <small className={'text-muted'}>{mTime.value}</small>}
                </span>
            </ListGroup.Item>
        );
    });

    const nodeLeafContents = folderContent.leaves.map((leaf, idx) => {
        const filePath = (path ? path + '/' : '') + leaf.name;
        const contentKey = '#' + leaf.name;
        const metadataAttr = folderContent.attributes.find(a => a.name === 'metadata');
        const webifiable = isLeafWebifiable(leaf);

        return (
            <Tab.Pane key={idx} eventKey={contentKey}>
                <FileContent selectedFormat={selectedFormat} webifiable={webifiable} path={filePath}
                             metadata={metadataAttr && metadataAttr.value}/>
            </Tab.Pane>
        );
    });

    return (
        <Tab.Container mountOnEnter={true} id="folder-content-tabs" defaultActiveKey={activeKey || '#no-selection'}>
            <Container>
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
                                <p>No selection...</p>
                            </Tab.Pane>
                            {nodeLeafContents}
                        </Tab.Content>
                    </Col>
                </Row>

            </Container>
        </Tab.Container>
    );
}

export default FolderContent;

import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "./Loader";
import {Alert, Col, Container, ListGroup, Row, Tab} from "react-bootstrap";
import {useRouteMatch} from "react-router";
import FileContent from "./FileContent";

type Props = {
    path: string,
    activeKey?: string,
}

const FolderContent: FunctionComponent<Props> = ({path, activeKey}: Props) => {

    const [folderContent, setFolderContent] = useState(undefined);

    useEffect(() => {
        fetch('https://pds-imaging.jpl.nasa.gov/w10n/' + path + '?output=json')
            .then(function (response) {
                if (response.status !== 200) {
                    throw new Error("Bad response from server for path: '" + path + "'!");
                }
                return response.json();
            })
            .then(function (content) {
                console.log("Received content:", content);
                setFolderContent(content);
            });
    }, []);

    if (!folderContent) {
        return (<Loader/>)
    }

    if (!folderContent.nodes) {
        return (
            <Alert variant={'info'}>
                There are no nodes!
            </Alert>
        )
    }

    const nodeItems = folderContent.nodes.map((node, idx) => {
        const mTime = node.attributes.find((attr) => attr.name === 'mtime');
        return (
            <ListGroup.Item className={'folder-content-item'} key={idx} action
                            href={'/data/' + (path ? path + '/' : '') + node.name}>
                <span>{node.name}</span><small className={'text-muted'}>{mTime.value}</small>
            </ListGroup.Item>
        );
    });

    const nodeLeaves = folderContent.leaves.map((leaf, idx) => {
        const mTime = leaf.attributes.find((attr) => attr.name === 'mtime');
        const size = leaf.attributes.find((attr) => attr.name === 'size');
        return (
            <ListGroup.Item className={'folder-content-item'} key={idx} action
                            href={'#' + leaf.name}>
                <span>{leaf.name}</span>
                <span className={'details'}>
                    <small className={'text-muted'}>{size.value + ' bytes'}</small>
                    <small className={'text-muted'}>{mTime.value}</small>
                </span>
            </ListGroup.Item>
        );
    });

    const nodeLeafContents = folderContent.leaves.map((leaf, idx) => {
        const filePath = (path ? path + '/' : '') + leaf.name;
        const contentKey = '#' + leaf.name;
        return (
            <Tab.Pane key={idx} eventKey={contentKey}>
                <FileContent path={filePath}/>
            </Tab.Pane>
        );
    });

    return (
        <Tab.Container mountOnEnter={true} id="folder-content-tabs" defaultActiveKey={activeKey || '#no-selection'}>
            <Container>
                <Row>
                    <Col sm={4}>
                        <ListGroup>
                            {nodeItems}
                            {nodeLeaves}
                        </ListGroup>
                    </Col>
                    <Col sm={8}>
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

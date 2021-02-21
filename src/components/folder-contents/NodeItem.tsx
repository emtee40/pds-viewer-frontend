import React, {FunctionComponent} from 'react';
import {ListGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {FileDirectoryIcon} from "@primer/octicons-react";
import {PDSNode} from "../../types/PDSNode";
import {buildHref} from "../FolderContent";
import {Link} from "react-router-dom";

type Props = {
    node: PDSNode,
    idx: number,
    path: string,
};

const NodeItem: FunctionComponent<Props> = ({node, idx, path}: Props) => {
    const mTime = node.attributes.find((attr) => attr.name === 'mtime');
    return (
        <OverlayTrigger
            key={idx}
            placement={'auto'}
            overlay={
                <Tooltip id={'node-' + idx}>{node.name}</Tooltip>
            }
        >
            <ListGroup.Item as={Link} className={'folder-content-item'} key={idx} action
                            to={buildHref(path, node)}>
                <div className="details">
                    <span className={'name'}>
                        <FileDirectoryIcon className={'file-icon'} verticalAlign={'text-top'}/>{' '}
                        <span>{node.name}</span>
                    </span>
                    {mTime && <small className={'text-muted'}>{mTime.value}</small>}
                </div>
            </ListGroup.Item>
        </OverlayTrigger>
    );
};

export default NodeItem;

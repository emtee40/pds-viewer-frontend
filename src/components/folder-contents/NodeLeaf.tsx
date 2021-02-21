import React, {FunctionComponent} from 'react';
import {FileIcon, FileMediaIcon} from "@primer/octicons-react";
import {ListGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {buildHref, isLeafWebifiable} from "../FolderContent";
import {PDSLeaf} from "../../types/PDSLeaf";

type Props = {
    path: string,
    leaf: PDSLeaf,
    idx: number,
}

const NodeLeaf: FunctionComponent<Props> = ({path, leaf, idx}: Props) => {

    const mTime = leaf.attributes.find((attr) => attr.name === 'mtime');
    const size = leaf.attributes.find((attr) => attr.name === 'size');
    const webifiable = isLeafWebifiable(leaf);

    const webifiableHref = buildHref(path, leaf);
    const fileViewHref = '#' + leaf.name;
    const href = (webifiable ? webifiableHref : fileViewHref);

    const fileIcon = (webifiable &&
        <FileMediaIcon className={'file-icon'} verticalAlign={'text-top'}/> ||
        <FileIcon className={'file-icon'} verticalAlign={'text-top'}/>)

    return (
        <OverlayTrigger
            key={idx}
            placement={'auto'}
            overlay={
                <Tooltip id={'leaf-' + idx}>{leaf.name}</Tooltip>
            }
        >
            <ListGroup.Item className={'folder-content-item'} key={idx} action
                            eventKey={href}>
                <span className={'name'}>
                    {fileIcon}{' '}
                    <span>{leaf.name}</span>
                </span>
                <span className={'details'}>
                    {size && <small className={'text-muted'}>{size.value + ' bytes'}</small>}
                    {mTime && <small className={'text-muted'}>{mTime.value}</small>}
                </span>
            </ListGroup.Item>
        </OverlayTrigger>
    );
};

export default NodeLeaf;

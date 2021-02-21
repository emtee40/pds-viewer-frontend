import React, {FunctionComponent} from 'react';
import {FileIcon, FileMediaIcon} from "@primer/octicons-react";
import {ListGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {isLeafWebifiable} from "../FolderContent";
import {PDSLeaf} from "../../types/PDSLeaf";

type Props = {
    leaf: PDSLeaf,
    idx: number,
    activeKey?: string,
    setActiveKey: (key: string) => void,
}

const NodeLeaf: FunctionComponent<Props> = ({leaf, idx, activeKey, setActiveKey}: Props) => {

    const mTime = leaf.attributes.find((attr) => attr.name === 'mtime');
    const size = leaf.attributes.find((attr) => attr.name === 'size');
    const webifiable = isLeafWebifiable(leaf);

    const fileIcon = (webifiable &&
        <FileMediaIcon className={'file-icon'} verticalAlign={'text-top'}/> ||
        <FileIcon className={'file-icon'} verticalAlign={'text-top'}/>)

    return (
        <OverlayTrigger
            key={idx}
            placement={'auto'}
            overlay={
                <Tooltip id={'leaf-' + idx}>{leaf.name}</Tooltip>
            }>
            <ListGroup.Item className={'folder-content-item'} key={idx} action
                            active={activeKey === leaf.name}
                            onClick={() => {
                                setActiveKey(leaf.name);
                            }}>
                <div className="details">
                    <span className={'name'}>
                        {fileIcon}
                        {' '}
                        <span>{leaf.name}</span>
                    </span>
                    <span className={'details'}>
                        {size && <small className={'text-muted'}>{size.value + ' bytes'}</small>}
                        {' '}
                        {mTime && <small className={'text-muted'}>{mTime.value}</small>}
                    </span>
                </div>
            </ListGroup.Item>
        </OverlayTrigger>
    );
};

export default NodeLeaf;

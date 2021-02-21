import React, {FunctionComponent} from 'react';
import {Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import {ChevronLeftIcon, DownloadIcon, ReplyIcon, SyncIcon} from "@primer/octicons-react";

type FileImageProps = {
    selectedFormat: string,
    imageBase64: string,
    getFileNameFromPath: () => string,
}

type Props = {
    imageProps?: FileImageProps,
    refreshFolderCache: () => void,
    navigateToParent: () => void,
}

const Toolbar: FunctionComponent<Props> = ({imageProps, refreshFolderCache, navigateToParent}: Props) => {

    const downloadImage = (): void => {
        if (imageProps) {
            const linkSource = 'data:image/' + imageProps.selectedFormat + ';base64' + imageProps.imageBase64;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = imageProps.getFileNameFromPath();
            downloadLink.click();
        } else {
            console.error('Not an image!');
        }
    };

    return (
        <ButtonToolbar className={'toolbar'} aria-label="Toolbar">
            <ButtonGroup aria-label="Folder Actions">
                <Button aria-label={'Go To Parent Folder'} variant={'outline-secondary'} onClick={navigateToParent}>
                    <ChevronLeftIcon />
                </Button>
                <Button aria-label={'Refresh Folder Contents'} variant={'outline-secondary'}
                        onClick={refreshFolderCache}>
                    <SyncIcon verticalAlign={'text-top'}/>
                </Button>
            </ButtonGroup>
            <ButtonGroup aria-label={'File Actions'}>
                {imageProps && <Button aria-label={'Download Image'} variant={'outline-secondary'}
                                       onClick={downloadImage}><DownloadIcon verticalAlign={"text-top"}/></Button>}
            </ButtonGroup>
        </ButtonToolbar>
    );
}

export default Toolbar;

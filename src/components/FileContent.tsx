import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "./Loader";
import {Alert} from "react-bootstrap";
import TextFile from "./file-contents/TextFile";
import ImageFile from "./file-contents/ImageFile";
import {API_URL} from "../App";
import {PDSLeaf} from "../types/PDSLeaf";
import FolderContent, {isLeafWebifiable} from "./FolderContent";
import {PDSNode} from "../types/PDSNode";
import {PDSAttribute} from "../types/PDSAttribute";

type Props = {
    path: string,
    leaf: PDSLeaf,
    selectedFormat: string,
    folderContent: PDSNode,
    refreshFolderCache: () => void,
    navigateToParent: () => void,
    imageCached: boolean,
    setImageCached: (imageCached: boolean) => void,
}

const FileContent: FunctionComponent<Props> = ({
                                                   path,
                                                   leaf,
                                                   selectedFormat,
                                                   folderContent,
                                                   refreshFolderCache,
                                                   navigateToParent,
                                                   imageCached,
                                                   setImageCached
                                               }: Props) => {

    const [fileContent, setFileContent] = useState(undefined);
    const [error, setError] = useState(false);

    const filePath = (path ? path + '/' : '') + leaf.name;
    const metadata = folderContent.attributes.find(a => a.name === 'metadata');
    const webifiable = isLeafWebifiable(leaf);

    const apiUrl = API_URL + (filePath.startsWith("/") ? filePath : '/' + filePath);
    const useJson = (metadata !== undefined) || webifiable;

    useEffect(() => {
        fetch(apiUrl + (useJson ? '/?output=json' : ''))
            .then(function (response) {
                if (response.status !== 200) {
                    setError(true);
                    throw new Error("Bad response from server for path: '" + filePath + "'!");
                }

                return response.text().then(text => {
                    return new Promise((res) => {
                        try {
                            const json = JSON.parse(text);
                            res(json);
                        } catch (e) {
                            console.warn("Error parsing as JSON, using text...", e);
                            res({
                                contentType: response.headers.get("Content-Type") || 'text/plain',
                                raw: text
                            });
                        }
                    });
                })
            })
            .then(function (content) {
                setFileContent(content);
            });
    }, []);

    if (error) {
        return (
            <Alert variant={'danger'}>
                <p>There was an error loading the requested file!</p>
                <p>You can try <a href={apiUrl}>opening the file directly</a>.</p>
            </Alert>
        )
    }

    if (!fileContent) {
        return (<Loader/>)
    }

    if (fileContent.contentType === 'text/plain') {
        return (<TextFile navigateToParent={navigateToParent} refreshFolderCache={refreshFolderCache}
                          content={fileContent}/>)
    }

    if (fileContent.w10n) {
        const typeAttr = fileContent.w10n.find(e => e.name === 'type');
        if (isImage(typeAttr)) {
            return (<ImageFile navigateToParent={navigateToParent} refreshFolderCache={refreshFolderCache}
                               fileContent={fileContent} selectedFormat={selectedFormat}
                               imageCached={imageCached} setImageCached={setImageCached}/>);
        }
    }

    return (
        <Alert variant={'warning'}>
            <p>The file type <code>{fileContent.contentType}</code> is currently not supported!</p>
            <p>You can still <a href={apiUrl} target={'_blank'} rel={'noopener noreferrer nofollow'}>download the
                file</a>!</p>
        </Alert>
    );
}

export default FileContent;

export const isImage = (typeAttr: PDSAttribute): boolean => {
    return typeAttr.value.toString().startsWith('imageio');
}

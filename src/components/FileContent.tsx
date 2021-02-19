import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "./Loader";
import {Alert} from "react-bootstrap";
import TextFile from "./file-contents/TextFile";

type Props = {
    path: string,
}

const FileContent: FunctionComponent<Props> = ({path}: Props) => {

    const [fileContent, setFileContent] = useState(undefined);

    const apiUrl = 'https://pds-imaging.jpl.nasa.gov/w10n/' + path;

    useEffect(() => {
        fetch( apiUrl + '?output=json')
            .then(function (response) {
                if (response.status !== 200) {
                    throw new Error("Bad response from server for path: '" + path + "'!");
                }
                return response.blob().then(blob => {
                    return {
                        contentType: response.headers.get("Content-Type") || 'application/octet-stream',
                        raw: blob
                    }
                })
            })
            .then(function (content) {
                console.log("Received content:", content);
                setFileContent(content);
            });
    }, []);

    if (!fileContent) {
        return (<Loader/>)
    }

    if(fileContent.contentType === 'text/plain') {
        return <TextFile content={fileContent} />
    }

    return (
        <Alert variant={'warning'}>
            <p>The file type <code>{fileContent.contentType}</code> is currently not supported!</p>
            <p>You can still <a href={apiUrl} target={'_blank'} rel={'noopener noreferrer nofollow'}>download the file</a>!</p>
        </Alert>
    );
}

export default FileContent;

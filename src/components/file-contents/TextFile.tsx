import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "../Loader";
import Toolbar from "./Toolbar";

type Props = {
    content: {
        raw: Blob,
        contentType: string,
    },
    refreshFolderCache: () => void,
    navigateToParent: ()=>void,
}

const TextFile: FunctionComponent<Props> = ({content, refreshFolderCache, navigateToParent}: Props) => {

    const [fileText, setFileText] = useState(undefined);

    if(content.contentType !== 'text/plain') {
        throw new Error("Invalid file type! Expected: 'text/plain', got: '" + content.contentType + "'");
    }

    useEffect(() => {
        if(content.raw.text) {
            content.raw.text().then((text) => setFileText(text));
        } else {
            setFileText(content.raw);
        }
    }, []);

    if(!fileText) {
        return (<Loader />);
    }

    return (
        <div className="file-content">
            <Toolbar navigateToParent={navigateToParent} refreshFolderCache={refreshFolderCache} imageProps={undefined}/>
            <pre className={'text-content'}>{fileText}</pre>
        </div>
    );
}

export default TextFile;

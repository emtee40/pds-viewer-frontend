import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "../Loader";
import Toolbar from "./Toolbar";
import {useTranslation} from "react-i18next";

type Props = {
    content: {
        raw: Blob,
        contentType: string,
    },
    refreshFolderCache: () => void,
    navigateToParent: () => void,
}

const TextFile: FunctionComponent<Props> = ({content, refreshFolderCache, navigateToParent}: Props) => {

    const [fileText, setFileText] = useState(undefined);
    const {t} = useTranslation();

    if (content.contentType !== 'text/plain') {
        throw new Error(t('file.text.invalid_file_type') + content.contentType + "'");
    }

    useEffect(() => {
        if (content.raw.text) {
            content.raw.text().then((text) => setFileText(text));
        } else {
            setFileText(content.raw);
        }
    }, []);

    if (!fileText) {
        return (<Loader/>);
    }

    return (
        <div className="file-content">
            <Toolbar navigateToParent={navigateToParent} refreshFolderCache={refreshFolderCache}
                     imageProps={undefined}/>
            <pre className={'text-content'}>{fileText}</pre>
        </div>
    );
}

export default TextFile;

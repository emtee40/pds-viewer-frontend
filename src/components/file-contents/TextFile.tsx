import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "../Loader";

type Props = {
    content: {
        raw: Blob,
        contentType: string,
    }
}

const TextFile: FunctionComponent<Props> = ({content}: Props) => {

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
        <pre className={'text-content'}>{fileText}</pre>
    );
}

export default TextFile;

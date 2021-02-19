import React, {FunctionComponent, useState} from 'react';
import Loader from "../Loader";

type Props = {
    path: string,
    alt: string,
    selectedFormat: string,
}

const ImageFile: FunctionComponent<Props> = ({path, alt, selectedFormat}: Props) => {

    const imageUrl = 'https://pds-imaging.jpl.nasa.gov/w10n/' + path + '[]?output=' + selectedFormat;

    const [loading, setLoading] = useState(true);

    const imageLoaded = () => {
        setLoading(false);
    }

    return (
        <>
            {loading && <Loader/>}
            <img alt={alt} style={{display: loading ? "none" : "block"}} src={imageUrl} onLoad={imageLoaded}
                 className={'image-content'}/>
        </>
    );
};

export default ImageFile;

import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "../Loader";
import {API_URL} from "../../App";
import {Alert} from "react-bootstrap";

type Props = {
    path: string,
    alt: string,
    selectedFormat: string,
}

const ImageFile: FunctionComponent<Props> = ({path, alt, selectedFormat}: Props) => {

    const imageUrl = API_URL + path + '[]?output=' + selectedFormat;

    const [imageBase64, setImageBase64] = useState(undefined);
    const [error, setError] = useState(false);


    useEffect(() => {


        fetch(imageUrl)
            .then(function (response) {
                if (response.status !== 200) {
                    setError(true);
                    throw new Error("Bad response from server for image: '" + path + "'!");
                }

                return response.blob()
            })
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    setImageBase64(reader.result.toString());
                }
            });
    }, [])

    if (error) {
        return (
            <Alert variant={'danger'}>
                <p>There was an error fetching the image.</p>
                <p>You can try <a target={'_blank'} rel={'noopener nofollow noreferrer'} href={imageUrl}>downloading it
                    manually</a>.</p>
            </Alert>
        );
    }

    if (!imageBase64) {
        return (<Loader/>);
    }

    return (
        <img alt={alt} src={imageBase64} className={'image-content'}/>
    );
};

export default ImageFile;

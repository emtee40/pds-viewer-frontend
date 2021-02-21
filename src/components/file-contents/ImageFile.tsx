import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "../Loader";
import {API_URL} from "../../App";
import {Alert, Dropdown} from "react-bootstrap";
import {GearIcon} from "@primer/octicons-react";
import {PDSImage} from "../../types/PDSImage";

type Props = {
    fileContent: PDSImage,
    selectedFormat: string,
}

const ImageFile: FunctionComponent<Props> = ({fileContent, selectedFormat}: Props) => {

    const imagePath = fileContent.w10n.find(a => a.name === 'path').value.toString().replace('/w10n', '');
    const imageIdentifier = fileContent.w10n.find(a => a.name === 'identifier').value.toString();
    const path = imagePath + imageIdentifier

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
    }, []);

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

    const getFileNameFromPath = () => {
        const splitPath = imagePath.split('/');
        return splitPath[splitPath.length - 1];
    };

    const downloadImage = (): void => {
        const linkSource = 'data:image/' + selectedFormat + ';base64' + imageBase64;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = getFileNameFromPath();
        downloadLink.click();
    };

    return (
        <div className={'image-file'}>
            <img alt={getFileNameFromPath()} src={imageBase64} className={'image-content'}/>
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="image-actions">
                    <GearIcon verticalAlign={"text-top"}/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={downloadImage}>Download</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default ImageFile;

import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from "../Loader";
import {API_URL} from "../../App";
import {Alert} from "react-bootstrap";
import {PDSImage} from "../../types/PDSImage";
import Toolbar from "./Toolbar";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

type Props = {
    fileContent: PDSImage,
    selectedFormat: string,
    refreshFolderCache: () => void,
    navigateToParent: () => void,
    imageCached: boolean,
    setImageCached: (imageCached: boolean) => void,
}

const ImageFile: FunctionComponent<Props> = ({
                                                 fileContent,
                                                 selectedFormat,
                                                 refreshFolderCache,
                                                 navigateToParent,
                                                 imageCached,
                                                 setImageCached
                                             }: Props) => {

    const imagePath = fileContent.w10n.find(a => a.name === 'path').value.toString().replace('/w10n', '');
    const imageIdentifier = fileContent.w10n.find(a => a.name === 'identifier').value.toString();
    const path = imagePath + imageIdentifier;

    const imageUrl = API_URL + path + '/0/image[]?output=' + selectedFormat;

    const [imageBase64, setImageBase64] = useState(undefined);
    const [error, setError] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const cached = getCachedImage(path);
        if (cached) {
            setImageBase64(cached);
            setImageCached(true);
            setError(false);
        } else {
            refreshCache(setImageBase64, setError, setImageCached, imageUrl, path, t);
        }
    }, [fileContent]);

    if (error) {
        return (
            <Alert variant={'danger'}>
                <p>{t('file.image.error.fetching.1')}</p>
                <p>
                    {t('file.image.error.fetching.2')}
                    <a target={'_blank'} rel={'noopener nofollow noreferrer'} href={imageUrl}>
                        {t('file.image.error.fetching.3')}
                    </a>.
                </p>
            </Alert>
        );
    }

    if (!imageBase64) {
        return (<Loader/>);
    }

    const getFileNameFromPath = () => {
        const splitPath = imagePath.split('/');
        const originalFileName = splitPath[splitPath.length - 1];
        const nameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.'))
        return nameWithoutExtension + "." + selectedFormat.toUpperCase();
    };

    return (
        <div className="file-content">
            <Toolbar navigateToParent={navigateToParent} refreshFolderCache={refreshFolderCache} imageProps={{
                getFileNameFromPath: getFileNameFromPath,
                imageBase64: imageBase64,
                selectedFormat: selectedFormat,
            }}/>
            <div className="image">
                <img alt={getFileNameFromPath()} src={imageBase64} className={'image-content'}/>
            </div>
        </div>
    );
};

const refreshCache = (
    setImageBase64: (base64: string) => void,
    setError: (error: boolean) => void,
    setCached: (cached: boolean) => void,
    imageUrl: string,
    path: string,
    t: TFunction,
) => {
    setImageBase64(undefined);
    setError(false);
    fetch(imageUrl)
        .then(function (response) {
            if (response.status !== 200) {
                setError(true);
                throw new Error(t('file.image.bad_response') + path + "'!");
            }

            return response.blob()
        })
        .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64 = reader.result.toString();
                setImageBase64(base64);
                localStorage.setItem('img-cache-' + (path === '' ? '/' : path), base64);
                setCached(false);
            }
        });
};

const getCachedImage = (path: string): string => {
    const cachedBase64 = localStorage.getItem('img-cache-' + (path === '' ? '/' : path));
    if (cachedBase64) {
        return cachedBase64;
    } else {
        return undefined;
    }
}

export default ImageFile;

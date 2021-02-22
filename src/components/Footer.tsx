import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, Row} from "react-bootstrap";
import {FileDirectoryIcon, FileMediaIcon, TrashIcon} from "@primer/octicons-react";
import {useLocation} from "react-router";
import {useTranslation} from "react-i18next";

type Props = {
    cached: boolean,
    imageCached: boolean,
}

const Footer: FunctionComponent<Props> = ({cached, imageCached}: Props) => {
    const [localStorageSize, setLocalStorageSize] = useState('');
    const [pathName, setPathName] = useState('');

    const location = useLocation();
    const {t} = useTranslation();

    function updateValues() {
        setLocalStorageSize(bytesToHumanReadable(new Blob(Object.values(localStorage)).size));

        let pathName = location.pathname.replace(/\/data/, '');
        if (pathName.length === 0) {
            pathName = '/';
        }
        setPathName(pathName);
    }

    useEffect(() => {
        updateValues();
    }, [location]);

    const directoryIcon = <FileDirectoryIcon size={12} verticalAlign={"text-top"}/>;
    const imageIcon = <FileMediaIcon size={12} verticalAlign={"text-top"}/>;

    const emptyCache = () => {
        window.localStorage.clear();
        updateValues();
        window.location.reload();
    };

    return (
        <Row className={'footer'}>
            <div className="left-side">
                <span>{t('footer.cache') + localStorageSize}</span>
                {' | '}
                <span onClick={emptyCache}>
                    <TrashIcon className={'footer-btn'} size={12} verticalAlign={'text-top'} aria-label={t('footer.empty_cache')}/>
                </span>
            </div>
            <div className="middle">
                {pathName}
            </div>
            <div className="right-side">
                {directoryIcon}{' '}{(cached ? t('footer.cached') : t('footer.from_api'))}
                {' | '}
                {imageIcon}{' '}{(imageCached ? t('footer.cached') : t('footer.from_api'))}
            </div>
        </Row>
    );
}

const bytesToHumanReadable = (bytes: number, decimals = 1): string => {
    const kb = 1024;

    if (Math.abs(bytes) < kb) {
        return bytes + ' B';
    }

    const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** decimals;

    do {
        bytes /= kb;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= kb && u < units.length - 1);

    return bytes.toFixed(decimals) + ' ' + units[u];
}

export default Footer;

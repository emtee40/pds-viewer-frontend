import React, {FunctionComponent} from 'react';
import {useTranslation} from "react-i18next";

type Props = {
    text?: string
}

const Loader: FunctionComponent<Props> = ({text}: Props) => {
    const {t} = useTranslation();
    return (
        <div id={'loader'}>
            <div className="loading-spinner">
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
            <p>{text || t('loader.loading_text')}</p>
        </div>
    );
}

export default Loader;

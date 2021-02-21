import React from 'react';
import {useTranslation} from "react-i18next";
import {Container} from "react-bootstrap";

const HelpPage = () => {
    const {t} = useTranslation();
    return (
        <Container>
            <h2>{t('help.about')}</h2>
            <p>
                {t('help.about_text_1')}
                <a href={'https://pds-imaging.jpl.nasa.gov/'}>{t('help.about_text_2')}</a>
                {t('help.about_text_3')}
            </p>
            <p>{t('help.about_text_4')}</p>
            <p>{t('help.about_text_5')}</p>
        </Container>
    );
}

export default HelpPage;

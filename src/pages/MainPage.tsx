import React from 'react';
import {Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MainPage = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <h2>{t('main.welcome')}</h2>
            <p>{t('main.intro')}</p>
            <Button as={Link} to={'/data/'} variant="outline-primary">
                {t('main.start_digging')}
            </Button>
        </Container>
    );
}

export default MainPage;

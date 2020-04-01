import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {

    const { t } = useTranslation('home');

    return (
        <div className='home'>
            <NavLink to='/test' className='button button--big button--important'>{t('test')}</NavLink>
            <NavLink to='/practice' className='button button--big'>{t('training')}</NavLink>
            <NavLink to='/summary' className='button button--big'>{t('summary')}</NavLink>
            <NavLink to='/about' className='button button--big'>{t('about')}</NavLink>
        </div>
    );
};

export default Home;

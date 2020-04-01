import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginRedirect = () => {

    const { t } = useTranslation('login-redirect');

    return (
        <div>
            <p>{t('info')}</p>
            <NavLink to='/' className='button button--important'>{t('login')}</NavLink><br />
            <NavLink to='/register' className='button'>{t('register')}</NavLink><br />
            <NavLink to='/home' className='button'>{t('back')}</NavLink>
        </div>
    );
};

export default LoginRedirect;

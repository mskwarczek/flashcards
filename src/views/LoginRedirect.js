import React from 'react';
import { NavLink } from 'react-router-dom';

const LoginRedirect = () => {
    return (
        <div>
            <p>Musisz się zalogować.</p>
            <NavLink to='/' className='button button--important'>Logowanie</NavLink><br />
            <NavLink to='/register' className='button'>Rejestracja</NavLink><br />
            <NavLink to='/home' className='button'>Powrót</NavLink>
        </div>
    );
};

export default LoginRedirect;

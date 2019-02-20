import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Summary(props) {

    return (
        <div className='summary'>
            <NavLink to='/home'><div className='button button--big'>Strona główna</div></NavLink>
        </div>
    );
}

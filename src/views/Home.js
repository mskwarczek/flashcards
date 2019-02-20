import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home(props) {

    return (
        <div className='home'>
            <NavLink to='/test'><div className='button button--big'>Test</div></NavLink>
        </div>
    );
}

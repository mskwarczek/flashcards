import React from 'react';
import { NavLink } from 'react-router-dom';

const Home = (props) => {

    return (
        <div className='home'>
            <NavLink to='/test' className='button button--big button--important'>Test</NavLink>
            <NavLink to='/practice' className='button button--big'>Trening</NavLink>
            <NavLink to='/summary' className='button button--big'>Podsumowanie</NavLink>
            <NavLink to='/about' className='button button--big'>O fiszkach</NavLink>
        </div>
    );
};

export default Home;

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Router from './common/Router';

export default class App extends Component {
    render() {
        return (
            <div className='app'>
                <Router />
                <NavLink to='/test'><div className='button button--big'>Test</div></NavLink>
            </div>
        );
    }
}

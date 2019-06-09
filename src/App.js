import React, { Component } from 'react';

import Router from './common/Router';
import Header from './views/Header';

export default class App extends Component {
    render() {
        return (
            <div className='app'>
                <Header />
                <Router />
            </div>
        );
    };
};

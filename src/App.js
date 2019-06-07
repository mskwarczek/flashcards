import React, { Component } from 'react';

import Router from './common/Router';

export default class App extends Component {
    render() {
        return (
            <div className='app'>
                <Router />
            </div>
        );
    };
};

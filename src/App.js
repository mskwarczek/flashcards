import React, { Component, Suspense } from 'react';

import Router from './common/Router';
import Header from './views/Header';

export default class App extends Component {
    render() {
        return (
            <div className='app'>
                <Suspense fallback={'loading...'}>
                    <Header />
                    <Router />
                </Suspense>
            </div>
        );
    };
};

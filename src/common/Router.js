import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from '../views/Login';
import Home from '../views/Home';
import Test from '../views/Test';
import Practice from '../views/Practice';
import Summary from '../views/Summary';

export default function Router() {
    return (
        <Switch >
            <Route exact path='/' component={Login} />
            <Route exact path='/home' component={Home} />
            <Route exact path='/test' component={Test} />
            <Route exact path='/practice' component={Practice} />
            <Route exact path='/summary' component={Summary} />
        </Switch>
    )
}

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Test from '../views/Test';

export default function Router() {
    return (
        <Switch >
            <Route exact path='/test' component={Test} />
        </Switch>
    )
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './common/index.scss';
import App from './App';
import store from './common/store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

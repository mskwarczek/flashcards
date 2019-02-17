import { combineReducers } from 'redux';

import cardsReducer from '../views/cardsReducer';

const reducers = combineReducers({
    cardsReducer,
});

export default reducers;
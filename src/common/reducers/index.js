import { combineReducers } from 'redux';

import cardsReducer from './cardsReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
    cardsReducer,
    userReducer
});

export default reducers;
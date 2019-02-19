import { combineReducers } from 'redux';

import cardsReducer from '../views/cardsReducer';
import userReducer from '../views/userReducer';

const reducers = combineReducers({
    cardsReducer,
    userReducer
});

export default reducers;
import deepFreeze from 'deep-freeze';

import { SET_USER_DATA, CLEAR_USER_DATA } from './userActions';

const initialState = {
    username: null,
    email: null,
    flashcards: null,
    isLoggedIn: false
};

const userReducer = (state = initialState, action) => {
    deepFreeze(state);
    switch (action.type) {
        case SET_USER_DATA:
            return action.payload.user;
        case CLEAR_USER_DATA:
            return initialState;
        default: return state;
    };
};

export default userReducer;

import deepFreeze from 'deep-freeze';

import { SET_USER_DATA, CLEAR_USER_DATA, RESET_FLASHCARDS } from './userActions';

const initialState = {
    username: null,
    email: null,
    activeFlashcardsSet: null,
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
        case RESET_FLASHCARDS:
            return { ...state, flashcards: [] };
        default: return state;
    };
};

export default userReducer;

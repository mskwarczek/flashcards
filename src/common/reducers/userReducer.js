import deepFreeze from 'deep-freeze';

import { SET_USER_DATA } from './userActions';

const userReducer = (state = {}, action) => {
    deepFreeze(state);
    switch (action.type) {
        case SET_USER_DATA:
            return action.payload.user;
        default: return state;
    };
};

export default userReducer;

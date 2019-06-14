export const SET_USER_DATA = 'SET_USER_DATA';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const UPDATE_FLASHCARDS_SET = 'UPDATE_FLASHCARDS_SET';
export const RESET_FLASHCARDS = 'RESET_FLASHCARDS';

export const setUserData = (user) => {
    return {
        type: SET_USER_DATA,
        payload: {
            user
        }
    };
};

export const clearUserData = () => {
    return {
        type: CLEAR_USER_DATA
    };
};

export const updateFlashcardsSet = (flashcardsSet) => {
    return {
        type: UPDATE_FLASHCARDS_SET,
        payload: {
            flashcardsSet
        }
    };
};

export const resetFlashcards = () => {
    return {
        type: RESET_FLASHCARDS
    };
};

export const FILL_CARDS_ARRAY = 'FILL_CARDS_ARRAY';
export const PUSH_FORWARD = 'PUSH_FORWARD';
export const PUSH_BACKWARD = 'PUSH_BACKWARD';

export function fillCardsArray(cardsArray) {
    return {
        type: FILL_CARDS_ARRAY,
        payload: {
            cardsArray
        }
    };
};

export function pushForward(id) {
    return {
        type: PUSH_FORWARD,
        payload: {
            id
        }
    };
};

export function pushBackward(id) {
    return {
        type: PUSH_BACKWARD,
        payload: {
            id
        }
    };
};

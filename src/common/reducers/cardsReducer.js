import deepFreeze from 'deep-freeze';

import { PUSH_FORWARD, PUSH_BACKWARD, FILL_CARDS_ARRAY } from './cardActions';

const cardsReducer = (state = [], action) => {
    deepFreeze(state);
    switch (action.type) {
        case PUSH_FORWARD:
            return state.map(card => {
                if (card.id === action.payload.id) {
                    let newValue = card.box + 1;
                    return { ...card, box: newValue };
                };
                return card;
            });
        case PUSH_BACKWARD:
            return state.map(card => {
                if (card.id === action.payload.id)
                    return { ...card, box: 1 };
                return card;
            });
        case FILL_CARDS_ARRAY:
            return action.payload.cardsArray;
        default: return state;
    };
};

export default cardsReducer;

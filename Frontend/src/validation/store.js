
import { createStore } from 'redux';

// Action Types
const VALIDATE_FIELD = 'VALIDATE_FIELD';

// Action Creator
export const validateField = (payload) => ({
  type: VALIDATE_FIELD,
  payload
});

// Initial State
const initialState = {
  errors: {}
};

// Reducer
const validationReducer = (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_FIELD:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.error
        }
      };
    default:
      return state;
  }
};

// Create Store
const store = createStore(validationReducer);

export default store;

// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create the formValidation slice using Redux Toolkit
const formValidationSlice = createSlice({
  name: 'formValidation',
  initialState: { errors: {} },
  reducers: {
    validateField(state, action) {
      const { field, error } = action.payload;
      state.errors[field] = error;
    },
  },
});

// Set up the Redux store using configureStore
const store = configureStore({
  reducer: {
    formValidation: formValidationSlice.reducer,
  },
});

export const { validateField } = formValidationSlice.actions;
export default store;

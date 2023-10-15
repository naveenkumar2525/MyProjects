import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  successSnackbarOpen: false,
  successSnackbarMessage: '',
  errorSnackbarMessage: '',
  errorSnackbarOpen: false,
};

const Snakebar = createSlice({
  name: 'snakebar',
  initialState,
  reducers: {
    SNACKBAR_SUCCESS(state, action) {
      state.successSnackbarOpen = true;
      state.successSnackbarMessage = action.payload;
    },
    SNACKBAR_CLEAR(state) {
      state.successSnackbarOpen = false;
      state.successSnackbarMessage = '';
      state.errorSnackbarOpen = false;
    },
    SNACKBAR_ERROR(state, action) {
      state.errorSnackbarOpen = true;
      state.errorSnackbarMessage = action.payload;
    },
  },
});

// Reducer
export default Snakebar.reducer;

// Actions
export const {
  SNACKBAR_SUCCESS,
  SNACKBAR_CLEAR,
  SNACKBAR_ERROR,
} = Snakebar.actions;
import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  themeMode: 'light',
  themeDirection: 'ltr'
};

const slice = createSlice({
  name: 'settings',
  showLoader: true,
  initialState,
  reducers: {
    switchMode(state, action) {
      state.themeMode = action.payload;
    },
    switchDirection(state, action) {
      state.themeDirection = action.payload;
    },
    beginLoading(state, action) {
      state.showLoader = true;
    },
    endLoading(state, action) {
      state.showLoader = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { switchMode, switchDirection, beginLoading, endLoading } = slice.actions;

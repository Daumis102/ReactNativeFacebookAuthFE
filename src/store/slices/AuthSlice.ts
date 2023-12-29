import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserState {
  authenticated: boolean;
}

const initialState: UserState = {
  authenticated: false,
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    logout: () => {
      // kicks off whole state reset in store.tsx
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthenticated } = authSlice.actions;

export default authSlice.reducer;

const getAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  getAuthState(state).authenticated;

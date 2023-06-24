
import { createSlice } from '@reduxjs/toolkit';
export const connectedExternalDbSlice = createSlice({
  name: 'connectedExternalDb',
  initialState: {
    value: false,
  },
  reducers: {
    connect: state => {
      state.value = true;
    },
    disconnect: state => {
      state.value = false;
    },
  },
});

export const { connect, disconnect } = connectedExternalDbSlice.actions;

export default connectedExternalDbSlice.reducer;

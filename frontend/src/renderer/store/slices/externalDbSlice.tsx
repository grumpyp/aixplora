
import { createSlice } from '@reduxjs/toolkit';
import {types} from "sass";
import Null = types.Null;
export const connectedExternalDbSlice = createSlice({
  name: 'connectedExternalDb',
  initialState: {
    value: false,
    apiKey: null,
    email: null,
  },
  reducers: {
    connect: state => {
      state.value = true;
    },
    disconnect: state => {
      state.value = false;
      // Reset Cloud Access
      state.apiKey = null;
      state.email = null;
      console.log("apikey---");
      console.log(state.apiKey);
    },
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
}});

export const { connect, disconnect, setApiKey, setEmail } = connectedExternalDbSlice.actions;

export default connectedExternalDbSlice.reducer;

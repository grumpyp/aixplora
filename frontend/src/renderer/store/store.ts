import { configureStore } from '@reduxjs/toolkit';
import connectedExternalDbReducer from './slices/externalDbSlice';

export default configureStore({
  reducer: {
    connectedExternalDb: connectedExternalDbReducer,
  }
})


import { configureStore } from '@reduxjs/toolkit';
import fileSpliceReducer from './features/fileSplice';

const store = configureStore({
  reducer: {
    files: fileSpliceReducer,
  },
});

export default store;

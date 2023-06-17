

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type } from 'os';
import { FileFormat, FileSpliceState, RootState } from 'renderer/Data';

const initialState: FileSpliceState = {
    files: [],
  };

  
const fileSpliceSlice = createSlice({
  name: 'fileSplice',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<FileFormat[]>) => {
      state.files.concat(action.payload);
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.name !== action.payload);
    },
  },
});

export const { addFile, removeFile } = fileSpliceSlice.actions;

export const currentFIles = (state: RootState) =>{
    return state.files
}

export default fileSpliceSlice.reducer;

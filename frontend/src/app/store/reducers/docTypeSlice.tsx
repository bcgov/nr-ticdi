import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocType } from '../../types/types';

interface DocumentTypeObjectState {
  selectedDocType: DocType;
  updatedDocType: DocType;
}

const initialState: DocumentTypeObjectState = {
  selectedDocType: {
    id: -1,
    name: '',
    created_by: '',
    created_date: '',
    create_userid: '',
    update_userid: '',
    create_timestamp: '',
    update_timestamp: '',
  },
  updatedDocType: {
    id: -1,
    name: '',
    created_by: '',
    created_date: '',
    create_userid: '',
    update_userid: '',
    create_timestamp: '',
    update_timestamp: '',
  },
};

const documentTypeObjectSlice = createSlice({
  name: 'documentTypeObject',
  initialState,
  reducers: {
    setDocType: (state, action: PayloadAction<DocType>) => {
      state.selectedDocType = action.payload;
      state.updatedDocType = action.payload;
    },
    setUpdatedDocType: (state, action: PayloadAction<DocType>) => {
      state.updatedDocType = action.payload;
    },
  },
});

export const { setDocType, setUpdatedDocType } = documentTypeObjectSlice.actions;

export default documentTypeObjectSlice.reducer;

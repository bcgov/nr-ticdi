import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocType } from '../../types/types';
import { ManageDocTypeProvision } from '../../common/manage-doc-types';

interface DocumentTypeObjectState {
  selectedDocType: DocType;
  updatedDocType: DocType;
  updatedProvisionsArray: ManageDocTypeProvision[];
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
  updatedProvisionsArray: [],
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
    setUpdatedProvisionsArray: (state, action: PayloadAction<ManageDocTypeProvision[]>) => {
      state.updatedProvisionsArray = action.payload;
    },
    clearUpdatedProvisionsArray: (state) => {
      state.updatedProvisionsArray = [];
    },
  },
});

export const { setDocType, setUpdatedDocType, setUpdatedProvisionsArray, clearUpdatedProvisionsArray } =
  documentTypeObjectSlice.actions;

export default documentTypeObjectSlice.reducer;

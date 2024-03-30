import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocType } from '../../types/types';

interface SearchState {
  dtid: number | null;
  document_type: DocType | null;
  searching: boolean; // when coming to the create document page from the search page this is true, otherwise false
}

const initialState: SearchState = {
  dtid: null,
  document_type: null,
  searching: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchState: (state, action: PayloadAction<Partial<SearchState>>) => {
      state.dtid = action.payload.dtid ?? state.dtid;
      state.document_type = action.payload.document_type ?? state.document_type;
      state.searching = action.payload.searching ?? state.searching;
    },
  },
});

export const { setSearchState } = searchSlice.actions;

export default searchSlice.reducer;

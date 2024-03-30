import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReducedProvisionDataObject } from '../../types/types';

interface ReducedProvisionDataObjectState {
  provisions: ReducedProvisionDataObject[];
  selectedProvisionIds: number[];
}

const initialState: ReducedProvisionDataObjectState = {
  provisions: [],
  selectedProvisionIds: [],
};

const provisionDataObjectSlice = createSlice({
  name: 'provisionDataObject',
  initialState,
  reducers: {
    setProvisionDataObjects: (state, action: PayloadAction<ReducedProvisionDataObject[]>) => {
      state.provisions = action.payload;
    },
    setSelectedProvisionIds: (state, action: PayloadAction<number[]>) => {
      state.selectedProvisionIds = action.payload;
    },
    selectProvision: (state, action: PayloadAction<number>) => {
      state.selectedProvisionIds.push(action.payload);
    },
    deselectProvision: (state, action: PayloadAction<number>) => {
      state.selectedProvisionIds = state.selectedProvisionIds.filter((id) => id !== action.payload);
    },
  },
});

export const { setProvisionDataObjects, setSelectedProvisionIds, selectProvision, deselectProvision } =
  provisionDataObjectSlice.actions;

export default provisionDataObjectSlice.reducer;

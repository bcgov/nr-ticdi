import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Variable } from '../../types/types';

interface VariableState {
  variables: Variable[];
  selectedVariableIds: number[];
}

const initialState: VariableState = {
  variables: [],
  selectedVariableIds: [],
};

const variableSlice = createSlice({
  name: 'variable',
  initialState,
  reducers: {
    setVariables: (state, action: PayloadAction<Variable[]>) => {
      // set all variables
      state.variables = action.payload;
    },
    updateVariable: (state, action: PayloadAction<Variable>) => {
      // update single variable
      const index = state.variables.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.variables[index] = action.payload;
      }
    },
    setSelectedVariableIds: (state, action: PayloadAction<number[]>) => {
      state.selectedVariableIds = action.payload;
    },
    selectVariable: (state, action: PayloadAction<number>) => {
      state.selectedVariableIds.push(action.payload);
    },
    deselectVariable: (state, action: PayloadAction<number>) => {
      state.selectedVariableIds = state.selectedVariableIds.filter((id) => id !== action.payload);
    },
  },
});

export const { setVariables, updateVariable, setSelectedVariableIds, selectVariable, deselectVariable } =
  variableSlice.actions;

export default variableSlice.reducer;

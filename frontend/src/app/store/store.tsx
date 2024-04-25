import { configureStore } from '@reduxjs/toolkit';
import provisionReducer from './reducers/provisionSlice';
import variableReducer from './reducers/variableSlice';
import searchReducer from './reducers/searchSlice';
import docTypeReducer from './reducers/docTypeSlice';

const store = configureStore({
  reducer: {
    provision: provisionReducer,
    variable: variableReducer,
    search: searchReducer,
    docType: docTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

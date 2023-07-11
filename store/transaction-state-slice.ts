import {
  AnyAction,
  PayloadAction,
  createAction,
  createReducer,
  createSlice,
} from '@reduxjs/toolkit';

const initialState = {
  fromDate: new Date(),
  toDate: new Date(),
  monthlyPressed: true,
  weeklyPressed: false,
  dailyPressed: false,
  customPressed: false,
  exportPressed: false,
};

const update = createAction<any>('update');

const transactStateReducer = createReducer(initialState, builder => {
  builder
    .addCase(update, (state, action) => {
      // action is inferred correctly here
      // console.log('payload', action.payload);
      return {
        ...state,
      };
    })
    // and provide a default case if no other handlers matched
    .addDefaultCase((state, action) => {});
});

// export const transactStateActions = transactStateReducer.actions;

export default transactStateReducer;

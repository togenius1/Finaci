import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// import {Expenses} from '../types';

// Define a type for the slice state

const weeklyTransactsSlice = createSlice({
  name: 'weeklyTransact',
  initialState: {
   weeklyTransacts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceWeeklyTransacts(state, action) {
      state.weeklyTransacts = action.payload.weeklyTransacts;
    },

    addExpense(state, action) {
      const newTransact = action.payload;
      const existingItem = state.weeklyTransacts.find(
        expense => expense.id === newTransact.id,
      );
      if (!existingItem) {
        state.weeklyTransacts.push({
          id: newTransact.id,
          Date: newTransact.Date,
          day: newTransact.day,
          Finance: newTransact.Finance,
        });
      }
    },
    deleteExpense(state, action) {
      const id = action.payload;
      const existingItem = state.weeklyTransacts.find(
        transact => transact.id === id,
      );
      if (existingItem) {
        state.weeklyTransacts = state.weeklyTransacts.filter(
         transact => transact.id !== id,
        );
      }
    },
    updateExpense(state, action) {
      const updatedTransactIndex = state.weeklyTransacts.findIndex(
        transact => transact.id === action.payload.id,
      );
      state.weeklyTransacts[updatedTransactIndex] = action.payload;
    },
  },
});

export const weeklyTransactsActions = weeklyTransactsSlice.actions;

export default weeklyTransactsSlice;

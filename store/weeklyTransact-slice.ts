import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// import {Expenses} from '../types';

// Define a type for the slice state

const weeklyTransactsSlice = createSlice({
  name: 'weeklyTransact',
  initialState: {
    weeklyTransacts: [],
  },
  reducers: {
    // Load data from DB or Backup storage to Mobile
    replaceWeeklyTransacts(state, action) {
      state.weeklyTransacts = action.payload.weeklyTransacts;
    },

    addWeeklyTransacts(state, action) {
      const newTransact = action.payload;
      const existingItem = state.weeklyTransacts.find(
        expense => expense.id === newTransact.id,
        // expense.week === newTransact.week &&
        // expense.year === newTransact.year &&
        // expense.month === newTransact.month,
      );
      if (!existingItem) {
        state.weeklyTransacts.push({
          id: newTransact.id,
          date: newTransact.date,
          year: newTransact.year,
          month: newTransact.month,
          week: newTransact.week,
          expense_weekly: newTransact.expense_weekly,
          income_weekly: newTransact.income_weekly,
        });
      }
    },
    deleteWeeklyTransacts(state, action) {
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
    updateWeeklyTransacts(state, action) {
      const updatedTransactIndex = state.weeklyTransacts.findIndex(
        transact => transact.id === action.payload.id,
      );
      state.weeklyTransacts[updatedTransactIndex] = action.payload;
    },
  },
});

export const weeklyTransactsActions = weeklyTransactsSlice.actions;

export default weeklyTransactsSlice;

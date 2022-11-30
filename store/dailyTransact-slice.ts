import {createSlice} from '@reduxjs/toolkit';

// import {Expenses} from '../types';

// Define a type for the slice state

const dailyTransactsSlice = createSlice({
  name: 'dailyTransact',
  initialState: {
    dailyTransacts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceDailyTransacts(state, action) {
      state.dailyTransacts = action.payload.dailyTransacts;
    },

    addDailyTransacts(state, action) {
      const newTransact = action.payload;
      const existingItem = state.dailyTransacts.find(
        transact => transact?.date === newTransact.date,
      );

      if (!existingItem) {
        state.dailyTransacts.push({
          id: newTransact.id,
          date: newTransact.date,
          day: newTransact.day,
          expense_daily: newTransact.expense_daily,
          income_daily: newTransact.income_daily,
        });
      }
    },
    deleteDailyTransacts(state, action) {
      const id = action.payload;
      const existingItem = state.dailyTransacts.find(
        transact => transact.id === id,
      );
      if (existingItem) {
        state.dailyTransacts = state.dailyTransacts.filter(
          transact => transact.id !== id,
        );
      }
    },
    updateDailyTransacts(state, action) {
      const updatedTransactIndex = state.dailyTransacts.findIndex(
        transact => transact.date === action.payload.date,
      );

      state.dailyTransacts[updatedTransactIndex] = action.payload;
    },
  },
});

export const dailyTransactsActions = dailyTransactsSlice.actions;

export default dailyTransactsSlice;

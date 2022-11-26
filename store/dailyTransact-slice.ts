import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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

    addExpense(state, action) {
      const newTransact = action.payload;
      const existingItem = state.dailyTransacts.find(
        transact => transact.id === newTransact.id,
      );
      if (!existingItem) {
        state.dailyTransacts.push({
          id: newTransact.id,
          Date: newTransact.Date,
          day: newTransact.day,
          Finance: newTransact.Finance,
        });
      }
    },
    deleteExpense(state, action) {
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
    updateExpense(state, action) {
      const updatedTransactIndex = state.dailyTransacts.findIndex(
        transact => transact.id === action.payload.id,
      );
      state.dailyTransacts[updatedTransactIndex] = action.payload;
    },
  },
});

export const dailyTransactsActions = dailyTransactsSlice.actions;

export default dailyTransactsSlice;

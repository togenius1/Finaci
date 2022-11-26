import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// import {Expenses} from '../types';

// Define a type for the slice state

const monthlyTransactsSlice = createSlice({
  name: 'monthlyTransact',
  initialState: {
    monthlyTransacts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceMonthlyTransacts(state, action) {
      state.monthlyTransacts = action.payload.monthlyTransacts;
    },

    addExpense(state, action) {
      const newTransact = action.payload;
      const existingItem = state.monthlyTransacts.find(
        transact => transact.id === newTransact.id,
      );
      if (!existingItem) {
        state.monthlyTransacts.push({
          id: newTransact.id,
          Date: newTransact.Date,
          day: newTransact.day,
          Finance: newTransact.Finance,
        });
      }
    },
    deleteExpense(state, action) {
      const id = action.payload;
      const existingItem = state.monthlyTransacts.find(
        transact => transact.id === id,
      );
      if (existingItem) {
        state.monthlyTransacts = state.monthlyTransacts.filter(
          transact => transact.id !== id,
        );
      }
    },
    updateExpense(state, action) {
      const updatedTransactIndex = state.monthlyTransacts.findIndex(
        transact => transact.id === action.payload.id,
      );
      state.monthlyTransacts[updatedTransactIndex] = action.payload;
    },
  },
});

export const monthlyTransactsActions = monthlyTransactsSlice.actions;

export default monthlyTransactsSlice;

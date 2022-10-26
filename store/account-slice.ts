import {createSlice} from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceAccount(state, action) {
      state.accounts = action.payload.expenses;
    },

    addAccount(state, action) {
      const newAccounts = action.payload;
      const existingItem = state.accounts.find(
        account => account.id === newAccounts.id,
      );
     
      if (!existingItem) {
        state.accounts.push({
          id: newAccounts.id,
          account: newAccounts.account,
          budget: newAccounts.budget,
          date: newAccounts.date,
        });
      }
    },
    deleteAccount(state, action) {
      const id = action.payload;
      const existingItem = state.expenses.find(expense => expense.id === id);
      if (existingItem) {
        state.expenses = state.expenses.filter(expense => expense.id !== id);
      }
    },
    updateAccount(state, action) {
      const updatedExpenseIndex = state.expenses.findIndex(
        expense => expense.id === action.payload.id,
      );
      state.expenses[updatedExpenseIndex] = action.payload;
    },
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice;

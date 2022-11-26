import {createSlice} from '@reduxjs/toolkit';

const cashAccountsSlice = createSlice({
  name: 'cash',
  initialState: {
    cashAccounts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceAccount(state, action) {
      state.cashAccounts = action.payload.cashAccounts;
    },

    addAccount(state, action) {
      const newCashAccount = action.payload;
      const existingItem = state.cashAccounts.find(
        cash => cash.id === newCashAccount.id,
      );

      if (!existingItem) {
        state.cashAccounts.push({
          id: newCashAccount.id,
          title: newCashAccount.title,
          budget: newCashAccount.budget,
          date: newCashAccount.date,
        });
      }
    },
    deleteAccount(state, action) {
      const id = action.payload;
      const existingItem = state.cashAccounts.find(cash => cash.id === id);
      if (existingItem) {
        state.cash = state.cashAccounts.filter(cash => cash.id !== id);
      }
    },
    updateAccount(state, action) {
      const updatedCashIndex = state.cashAccounts.findIndex(
        cash => cash.id === action.payload.id,
      );
      state.cashAccounts[updatedCashIndex] = action.payload;
    },
  },
});

export const cashAccountsActions = cashAccountsSlice.actions;

export default cashAccountsSlice;

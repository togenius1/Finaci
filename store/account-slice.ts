import {createSlice} from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceAccount(state, action) {
      state.accounts = action.payload.accounts;
    },

    addAccount(state, action) {
      const newAccounts = action.payload;
      const existingItem = state.accounts.find(
        account => account.id === newAccounts.id,
      );

      if (!existingItem) {
        state.accounts.push({
          id: newAccounts.id,
          title: newAccounts.title,
          budget: newAccounts.budget,
          date: newAccounts.date,
     
        });
      }
    },
    deleteAccount(state, action) {
      const id = action.payload.accountId;
      console.log(id);
      const existingItem = state.accounts.find(account => account.id === id);
      if (existingItem) {
        state.accounts = state.accounts.filter(account => account.id !== id);
      }
    },
    updateAccount(state, action) {
      const updatedAccountIndex = state.accounts.findIndex(
        account => account.id === action.payload.id,
      );
      state.accounts[updatedAccountIndex] = action.payload;
    },
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice;

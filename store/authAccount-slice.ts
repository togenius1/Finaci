import {createSlice} from '@reduxjs/toolkit';

const authAccountsSlice = createSlice({
  name: 'authAccount',
  initialState: {
    authAccounts: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceAuthAccount(state, action) {
      state.authAccounts = action.payload.authAccounts;
    },

    // Add
    addAuthAccount(state, action) {
      const newAuthAccounts = action.payload;
      const existingItem = state.authAccounts.find(
        account => account.id === newAuthAccounts.id,
      );

      if (!existingItem) {
        state.authAccounts.push({
          id: newAuthAccounts.id,
          name: newAuthAccounts.name,
          backupKey: newAuthAccounts.backupKey, // SecretKey
          publicKey: newAuthAccounts.publicKey,
          keyCreatedDate: newAuthAccounts.keyCreatedDate,
        });
      }
    },
    // Delete
    deleteAuthAccount(state, action) {
      const id = action.payload.id;
      const existingItem = state.authAccounts.find(
        account => account.id === id,
      );
      if (existingItem) {
        state.authAccounts = state.authAccounts.filter(
          account => account.id !== id,
        );
      }
    },

    // Update
    updateAuthAccount(state, action) {
      const updatedAccountIndex = state.authAccounts.findIndex(
        account => account.id === action.payload.id,
      );
      state.authAccounts[updatedAccountIndex] = action.payload;
    },
  },
});

export const authAccountsActions = authAccountsSlice.actions;

export default authAccountsSlice;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const transferSlice = createSlice({
  name: 'transfer',
  initialState: {
    transfers: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceTransfer(state, action) {
      state.transfers = action.payload.transfers;
    },

    addTransfer(state, action) {
      const newTransfers = action.payload;
      const existingItem = state.transfers.find(
        transfer => transfer.id === newTransfers?.id,
      );
      if (!existingItem) {
        state.transfers.push({
          id: newTransfers.id,
          cateId: newTransfers.cateId,
          accountId: newTransfers.accountId,
          amount: newTransfers.amount,
          note: newTransfers.note,
          date: newTransfers.date,
        });
      }
    },
    deleteTransfer(state, action) {
      const id = action.payload;
      const existingItem = state.transfers.find(transfer => transfer.id === id);
      if (existingItem) {
        state.transfers = state.transfers.filter(
          transfer => transfer.id !== id,
        );
      }
    },
    updateTransfer(state, action) {
      const updatedTransferIndex = state.transfers.findIndex(
        transfer => transfer.id === action.payload.id,
      );
      state.transfers[updatedTransferIndex] = action.payload;
    },
  },
});

export const transferActions = transferSlice.actions;

export default transferSlice;

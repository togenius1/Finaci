import {createSlice} from '@reduxjs/toolkit';

const customerInfoSlice = createSlice({
  name: 'customerInfo',
  initialState: {
    customerInfos: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceCustomerInfo(state, action) {
      state.customerInfos = action.payload.customerInfo;
    },

    addCustomerInfo(state, action) {
      const newCustomerInfos = action.payload;
      const existingItem = state.customerInfos.find(
        account => account.id === newCustomerInfos.id,
      );

      if (!existingItem) {
        state.customerInfos.push({
          id: newCustomerInfos.id,
          appUserId: newCustomerInfos.appUserId,
          stdActive: newCustomerInfos.stdActive,
          proActive: newCustomerInfos.proActive,
          date: newCustomerInfos.date,
        });
      }
    },
    deleteCustomerInfo(state, action) {
      const id = action.payload.accountId;
      const existingItem = state.customerInfos.find(
        customer => customer.id === id,
      );
      if (existingItem) {
        state.customerInfos = state.customerInfos.filter(
          customer => customer.id !== id,
        );
      }
    },
    updateCustomerInfo(state, action) {
      const updatedAccountIndex = state.customerInfos.findIndex(
        customerInfo => customerInfo.id === action.payload.id,
      );
      state.customerInfos[updatedAccountIndex] = action.payload;
    },
  },
});

export const customerInfoActions = customerInfoSlice.actions;

export default customerInfoSlice;

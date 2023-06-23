import {createSlice} from '@reduxjs/toolkit';

const transferCategoriesSlice = createSlice({
  name: 'transferCategory',
  initialState: {
    transferCategories: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceTransferCategories(state, action) {
      state.transferCategories = action.payload.transferCategories;
    },

    addCategory(state, action) {
      const newCategories = action.payload;
      const existingItem = state.transferCategories.find(
        cate => cate.id === newCategories.id,
      );

      if (!existingItem) {
        state.transferCategories.push({
          id: newCategories.id,
          title: newCategories.title,
          date: newCategories.date,
        });
      }
    },
    deleteCategory(state, action) {
      const id = action.payload;
      const existingItem = state.transferCategories.find(cate => cate.id === id);
      if (existingItem) {
        state.transferCategories = state.transferCategories.filter(
          cate => cate.id !== id,
        );
      }
    },
    updateCategory(state, action) {
      const updatedCategoryIndex = state.transferCategories.findIndex(
        cate => cate.id === action.payload.id,
      );
      state.transferCategories[updatedCategoryIndex] = action.payload;
    },
  },
});

export const transferCategoriesActions = transferCategoriesSlice.actions;

export default transferCategoriesSlice;

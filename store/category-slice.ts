import {createSlice} from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceCategory(state, action) {
      state.categories = action.payload.expenses;
    },

    addCategory(state, action) {
      const newCategories = action.payload;
      const existingItem = state.categories.find(
        cate => cate.id === newCategories.id,
      );
     
      if (!existingItem) {
        state.categories.push({
          id: newCategories.id,
          category: newCategories.account,
          date: newCategories.date,
        });
      }
    },
    deleteCategory(state, action) {
      const id = action.payload;
      const existingItem = state.categories.find(cate => cate.id === id);
      if (existingItem) {
        state.categories = state.categories.filter(cate => cate.id !== id);
      }
    },
    updateCategory(state, action) {
      const updatedExpenseIndex = state.categories.findIndex(
        cate => cate.id === action.payload.id,
      );
      state.categories[updatedExpenseIndex] = action.payload;
    },
  },
});

export const categoryActions = categorySlice.actions;

export default categorySlice;

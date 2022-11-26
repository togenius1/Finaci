import {createSlice} from '@reduxjs/toolkit';

const incomeCategoriesSlice = createSlice({
  name: 'incomeCategory',
  initialState: {
    incomeCategories: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceIncomeCategories(state, action) {
      state.incomeCategories = action.payload.incomeCategories;
    },

    addCategory(state, action) {
      const newCategories = action.payload;
      const existingItem = state.incomeCategories.find(
        cate => cate.id === newCategories.id,
      );

      if (!existingItem) {
        state.incomeCategories.push({
          id: newCategories.id,
          title: newCategories.title,
          date: newCategories.date,
        });
      }
    },
    deleteCategory(state, action) {
      const id = action.payload;
      const existingItem = state.incomeCategories.find(cate => cate.id === id);
      if (existingItem) {
        state.incomeCategories = state.incomeCategories.filter(
          cate => cate.id !== id,
        );
      }
    },
    updateCategory(state, action) {
      const updatedCategoryIndex = state.incomeCategories.findIndex(
        cate => cate.id === action.payload.id,
      );
      state.incomeCategories[updatedCategoryIndex] = action.payload;
    },
  },
});

export const incomeCategoriesActions = incomeCategoriesSlice.actions;

export default incomeCategoriesSlice;

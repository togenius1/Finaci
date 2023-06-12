import {createSlice} from '@reduxjs/toolkit';

const expenseCategoriesSlice = createSlice({
  name: 'expenseCategory',
  initialState: {
    expenseCategories: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceExpenseCategories(state, action) {
      state.expenseCategories = action.payload.expenseCategories;
    },

    addExpenseCategories(state, action) {
      const newCategories = action.payload;
      const existingItem = state.expenseCategories.find(
        cate => cate.id === newCategories.id,
      );

      if (!existingItem) {
        state.expenseCategories.push({
          id: newCategories.id,
          title: newCategories.title,
          date: newCategories.date,
        });
      }
    },
    deleteExpenseCategories(state, action) {
      const id = action.payload.id;
      const existingItem = state.expenseCategories.find(cate => cate.id === id);
      if (existingItem) {
        state.expenseCategories = state.expenseCategories.filter(
          cate => cate.id !== id,
        );
      }
    },
    updateExpenseCategories(state, action) {
      const updatedCategoryIndex = state.expenseCategories.findIndex(
        cate => cate.id === action.payload.id,
      );
      state.expenseCategories[updatedCategoryIndex] = action.payload;
    },
  },
});

export const expenseCategoriesActions = expenseCategoriesSlice.actions;

export default expenseCategoriesSlice;

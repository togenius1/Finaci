import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// import {Expenses} from '../types';

// Define a type for the slice state

const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    expenses: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceExpenses(state, action) {
      state.expenses = action.payload.expenses;
    },

    addExpense(state, action) {
      const newExpenses = action.payload;
      const existingItem = state.expenses.find(
        expense => expense?.id === newExpenses?.id,
      );
      if (!existingItem) {
        state.expenses.push({
          id: newExpenses.id,
          accountId: newExpenses.accountId,
          cateId: newExpenses.cateId,
          amount: newExpenses.amount,
          note: newExpenses.note,
          date: newExpenses.date,
        });
      }
    },
    deleteExpense(state, action) {
      const id = action.payload;
      const existingItem = state.expenses.find(expense => expense.id === id);
      if (existingItem) {
        state.expenses = state.expenses.filter(expense => expense.id !== id);
      }
    },
    updateExpense(state, action) {
      const updatedExpenseIndex = state.expenses.findIndex(
        expense => expense.id === action.payload.id,
      );
      state.expenses[updatedExpenseIndex] = action.payload;
    },
  },
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice;

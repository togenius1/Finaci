import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    incomes: [],
  },
  reducers: {
    // Load data from DB to Mobile
    replaceIncome(state, action) {
      // console.log('income payload.income:', action.payload.incomes);
      state.incomes = action.payload.incomes;
    },

    addIncome(state, action) {
      const newIncomes = action.payload;
      const existingItem = state.incomes.find(
        income => income?.id === newIncomes?.id,
      );
      if (!existingItem) {
        state.incomes.push({
          id: newIncomes.id,
          accountId: newIncomes.accountId,
          cateId: newIncomes.cateId,
          amount: newIncomes.amount,
          note: newIncomes.note,
          date: newIncomes.date,
        });
      }
    },
    deleteIncome(state, action) {
      const id = action.payload.incomeId;
      const existingItem = state.incomes.find(income => income.id === id);
      if (existingItem) {
        state.incomes = state.incomes.filter(income => income.id !== id);
      }
    },
    updateIncome(state, action) {
      const updatedIncomeIndex = state.incomes.findIndex(
        income => income.id === action.payload.id,
      );
      state.incomes[updatedIncomeIndex] = action.payload;
    },
  },
});

export const incomeActions = incomeSlice.actions;

export default incomeSlice;

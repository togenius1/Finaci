import {createSlice} from '@reduxjs/toolkit';

const totalIncomeMonthlySlice = createSlice({
  name: 'totalIncomeMonthly',
  initialState: {
    totalIncomesMonthly: [],
  },
  reducers: {
    // Load data from Cloud DB to Mobile
    replaceTotalIncome(state, action) {
      // console.log('income payload.income:', action.payload.incomes);
      state.totalIncomesMonthly = action.payload.totalIncomes;
    },

    addTotalIncome(state, action) {
      const newTotalIncomes = action.payload;
      const existingItem = state.totalIncomesMonthly.find(
        total => total?.id === newTotalIncomes?.id,
      );
      if (!existingItem) {
        state.totalIncomesMonthly.push({
          id: newTotalIncomes.id,
          amount: newTotalIncomes.amount,
          month: newTotalIncomes.month,
          year: newTotalIncomes.year,
        });
      }
    },
    deleteTotalIncome(state, action) {
      const id = action.payload.id;
      const existingItem = state.totalIncomesMonthly?.find(total => total.id === id);
      if (existingItem) {
        state.totalIncomesMonthly = state.totalIncomesMonthly.filter(
          total => total.id !== id,
        );
      }
    },
    updateTotalIncome(state, action) {
      const updatedTotalIncomeIndex = state.totalIncomesMonthly?.findIndex(
        income => income.id === action.payload.id,
      );
      state.totalIncomesMonthly[updatedTotalIncomeIndex] = action.payload;
    },
  },
});

export const totalIncomeActions = totalIncomeMonthlySlice.actions;

export default totalIncomeMonthlySlice;

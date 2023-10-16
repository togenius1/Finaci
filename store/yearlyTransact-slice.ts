// import {createSlice} from '@reduxjs/toolkit';

// const yearlyTransactSlice = createSlice({
//   name: 'yearlyTransact',
//   initialState: {
//     yearlyTransacts: [],
//   },
//   reducers: {
//     // Load data from Cloud DB to Mobile
//     replaceTotalIncome(state, action) {
//       // console.log('income payload.income:', action.payload.incomes);
//       state.yearlyTransacts = action.payload.yearlyTransacts;
//     },

//     addTotalIncome(state, action) {
//       const newTransact = action.payload;
//       const existingItem = state.yearlyTransacts.find(
//         total => total?.id === newTransact?.id,
//       );
//       if (!existingItem) {
//         state.yearlyTransacts.push({
//           id: newTransact.id,
//           date: newTransact.date,
//           month: newTransact.month,
//           expense_yearly: newTransact.expense_yearly,
//           income_yearly: newTransact.income_yearly,
//         });
//       }
//     },
//     deleteTotalIncome(state, action) {
//       const id = action.payload.id;
//       const existingItem = state.yearlyTransacts?.find(
//         total => total.id === id,
//       );
//       if (existingItem) {
//         state.yearlyTransacts = state.yearlyTransacts.filter(
//           total => total.id !== id,
//         );
//       }
//     },
//     updateTotalIncome(state, action) {
//       const updatedYearlyIndex = state.yearlyTransacts?.findIndex(
//         income => income.id === action.payload.id,
//       );
//       state.yearlyTransacts[updatedYearlyIndex] = action.payload;
//     },
//   },
// });

// export const yearlyTransactActions = yearlyTransactSlice.actions;

// export default yearlyTransactSlice;

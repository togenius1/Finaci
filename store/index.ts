import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
// import thunk from 'redux-thunk';

import expenseSlice from './expense-slice';
import incomeSlice from './income-slice';
// import transferSlice from './transfer-slice';
import cashAccountsSlice from './cash-slice';
import accountSlice from './account-slice';
import expenseCategoriesSlice from './expense-category-slice';
import incomeCategoriesSlice from './income-category-slice';
import transferCategoriesSlice from './transfer-category-slice';
import dailyTransactsSlice from './dailyTransact-slice';
import weeklyTransactsSlice from './weeklyTransact-slice';
import monthlyTransactsSlice from './monthlyTransact-slice';
import authAccountsSlice from './authAccount-slice';
import customerInfoSlice from './customerInfo-slice';
// import yearlyTransactSlice from './yearlyTransact-slice';

const rootReducer = combineReducers({
  expenses: expenseSlice.reducer,
  incomes: incomeSlice.reducer,

  // transfers: transferSlice.reducer,
  authAccounts: authAccountsSlice.reducer,
  cashAccounts: cashAccountsSlice.reducer,
  accounts: accountSlice.reducer,
  customerInfos: customerInfoSlice.reducer,
  expenseCategories: expenseCategoriesSlice.reducer,
  incomeCategories: incomeCategoriesSlice.reducer,
  transferCategories: transferCategoriesSlice.reducer,
  dailyTransacts: dailyTransactsSlice.reducer,
  weeklyTransacts: weeklyTransactsSlice.reducer,
  monthlyTransacts: monthlyTransactsSlice.reducer,
  // yearlyTransacts: yearlyTransactSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
// import thunk from 'redux-thunk';

import expenseSlice from './expense-slice';
import incomeSlice from './income-slice';
import transferSlice from './transfer-slice';
import accountSlice from './account-slice';
import categorySlice from './category-slice';

const rootReducer = combineReducers({
  expenses: expenseSlice.reducer,
  incomes: incomeSlice.reducer,
  transfers: transferSlice.reducer,
  accounts: accountSlice.reducer,
  categories: categorySlice.reducer,
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

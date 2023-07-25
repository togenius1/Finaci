import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const getExpenseState = (state: RootState) => state.expenses;
// export const getIncomeState = (state: RootState) => state.incomes;
// export const getCustomerInfoState = (state: RootState) => state.customerInfos;

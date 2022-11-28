import AsyncStorage from '@react-native-async-storage/async-storage';

import {expenseActions} from './expense-slice';
import {EXPENSES} from '../dummy/dummy';

export const fetchExpensesData = () => {
  return async dispatch => {
    const fetchData = async () => {
      // const response = Load data from Amplify Data store.
      // const response = EXPENSES;
      await AsyncStorage.removeItem('root');
      const response = null;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const ExpensesData = await fetchData();
      dispatch(
        expenseActions.replaceExpenses({
          expenses: ExpensesData || [],
        }),
      );
    } catch (error) {}
  };
};

/* 
Don't have to fetch data from AsyncStorage.
Redux-persist will automatically retrieve data from AsyncStorage 
,so don't have to do the same as Amplify: 
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {MonthTransactions} from '../dummy/transactions/monthlyTransact';
import {monthlyTransactsActions} from './monthlyTransact-slice';

export const fetchMonthlyTransactsData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      // const response = MonthTransactions;
      await AsyncStorage.removeItem('root');
      const response = null;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const MonthlyTransactsData = await fetchData();
      dispatch(
        monthlyTransactsActions.replaceMonthlyTransacts({
          monthlyTransacts: MonthlyTransactsData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  initialWeekTransactions,
  weekTransactions,
} from '../dummy/transactions/weeklyTransact';

import {weeklyTransactsActions} from './weeklyTransact-slice';

export const fetchWeeklyTransactsData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      // const response = weekTransactions;

      // const response = initialWeekTransactions;
      await AsyncStorage.removeItem('root');
      const response = null;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const WeeklyTransactsData = await fetchData();
      dispatch(
        weeklyTransactsActions.replaceWeeklyTransacts({
          weeklyTransacts: WeeklyTransactsData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

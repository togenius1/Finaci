import AsyncStorage from '@react-native-async-storage/async-storage';

import {incomeActions} from './income-slice';
import {INCOME} from '../dummy/dummy';

export const fetchIncomesData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      const response = INCOME;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const IncomesData = await fetchData();
      dispatch(
        incomeActions.replaceIncome({
          incomes: IncomesData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

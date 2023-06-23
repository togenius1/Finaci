import AsyncStorage from '@react-native-async-storage/async-storage';

import {incomeActions} from './income-slice';
import {INCOME} from '../dummy/dummy';

// fetch data from cloud and replace local storage
export const fetchIncomesData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      // const response = INCOME;
      await AsyncStorage.removeItem('root');
      const response = null;

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

// Replace an income data to local storage
// export const replaceIncomesData = obj => {
//   console.log('income: ', obj);
//   return async dispatch => {
//     const fetchData = async () => {
//       const response = obj;
//       // return response !== null ? JSON.stringify(response) : null;
//       return response !== null ? response : null;
//     };

//     try {
//       const IncomesData = await fetchData();
//       dispatch(
//         incomeActions.replaceIncome({
//           incomes: IncomesData,
//         }),
//       );
//     } catch (error) {}
//   };
// };

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

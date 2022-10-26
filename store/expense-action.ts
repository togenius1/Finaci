// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {expenseActions} from './expenses-slice';

// import {DUMMY_EXPENSES} from '../dummy/dummy';
// export const fetchExpensesData = () => {
//   return async dispatch => {
//     const fetchData = async () => {
//       //   const response = await AsyncStorage.getItem('root');
//       const response = DUMMY_EXPENSES;

//       return response !== null ? JSON.stringify(response) : null;
//     };

//     try {
//       const ExpensesData = await fetchData();
//       dispatch(
//         expenseActions.replaceExpenses({
//           expenses: ExpensesData || [],
//         }),
//       );
//     } catch (error) {}
//   };
// };

// /* Redux-persist will automatically retrieve data from AsyncStorage 
// ,so dont have to do the same as Amplify*/

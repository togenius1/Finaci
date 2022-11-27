import AsyncStorage from '@react-native-async-storage/async-storage';

import {IncomeCategory} from '../dummy/categoryItems';
import {incomeCategoriesActions} from './income-category-slice';

export const fetchIncomeCategoriesData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      const response = IncomeCategory; // to load provisioned account category.

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const IncomeCategoriesData = await fetchData();
      dispatch(
        incomeCategoriesActions.replaceIncomeCategories({
          incomeCategories: IncomeCategoriesData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

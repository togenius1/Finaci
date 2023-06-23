import AsyncStorage from '@react-native-async-storage/async-storage';

import {TransferCategory} from '../dummy/categoryItems';

import {transferCategoriesActions} from './transfer-category-slice';

export const fetchTransferCategoriesData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      const response = TransferCategory;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const TransferCategoriesData = await fetchData();
      dispatch(
        transferCategoriesActions.replaceTransferCategories({
          transferCategories: TransferCategoriesData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

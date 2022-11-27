import AsyncStorage from '@react-native-async-storage/async-storage';

import {CashCategory} from '../dummy/account';
import {cashAccountsActions} from './cash-slice';

export const fetchCashAccountsData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      const response = CashCategory; // to load provisioned account category.

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const CashAccountsData = await fetchData();
      dispatch(
       cashAccountsActions.replaceAccount({
          cashAccounts: CashAccountsData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/
